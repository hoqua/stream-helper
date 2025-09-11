import { test, expect } from '@playwright/test';
import { StreamApiClient } from './lib/api-client';
import { createTestStreamRequest } from './lib/test-fixtures';

test.describe('Stream Subscription E2E', () => {
  let apiClient: StreamApiClient;
  let baseUrl: string;

  test.beforeEach(async ({ request, baseURL }) => {
    if (!baseURL) {
      throw new Error('No base URL provided. Configure baseURL in playwright config.');
    }
    baseUrl = baseURL;
    apiClient = new StreamApiClient(request, baseUrl);
  });

  test('basic stream lifecycle', async () => {
    const streamRequest = createTestStreamRequest();

    // Create stream
    const { response: subResponse, data: subData } = await apiClient.subscribe(streamRequest);
    expect(subResponse.ok()).toBeTruthy();
    expect(subData.streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    const { response: activeResponse, data: activeData } = await apiClient.getActive();
    expect(activeResponse.ok()).toBeTruthy();
    expect(activeData.activeStreams).toContain(subData.streamId);

    // Stop stream
    const { response: stopResponse, data: stopData } = await apiClient.stop(subData.streamId);
    expect(stopResponse.ok()).toBeTruthy();
    expect(stopData.streamId).toBe(subData.streamId);

    // Verify stream is removed
    const { response: finalResponse, data: finalData } = await apiClient.getActive();
    expect(finalResponse.ok()).toBeTruthy();
    expect(finalData.activeStreams).not.toContain(subData.streamId);
  });

  test('validation errors', async () => {
    const tests = [
      { streamUrl: 'not-a-url', name: 'invalid stream URL' },
      { webhookUrl: 'invalid-webhook', name: 'invalid webhook URL' },
      { streamUrl: undefined, projectId: undefined, name: 'missing required fields' },
    ];

    for (const testCase of tests) {
      const response = await apiClient.request.post(`${baseUrl}/api/stream/subscribe`, {
        data: { ...createTestStreamRequest(), ...testCase },
      });
      expect(response.status(), `${testCase.name} should return 400`).toBe(400);
    }
  });

  test('post request with headers', async () => {
    const streamRequest = createTestStreamRequest({
      method: 'POST',
      streamUrl: 'https://httpbin.org/post',
      headers: { 'Content-Type': 'application/json' },
      body: { test: 'data' },
    });

    const { data } = await apiClient.subscribe(streamRequest);
    await apiClient.stop(data.streamId);
  });

  test('e2e data setup verification', async () => {
    // Verify that our seeded project ID exists by trying to create a stream
    const streamRequest = createTestStreamRequest();
    expect(streamRequest.projectId).toBe('prj_test_e2e_streaming');
    
    // This test will fail if the project doesn't exist in the database
    // due to foreign key constraint, which confirms our seeding worked
    const { data } = await apiClient.subscribe(streamRequest);
    expect(data.streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    
    // Clean up the test stream
    await apiClient.stop(data.streamId);
  });

  test('long stream handling (100 events)', async () => {
    // Test with 100-event stream to verify handling of longer streams
    const streamRequest = createTestStreamRequest({
      streamUrl: 'https://httpbin.org/stream/100'
    });

    // Create stream
    const { data } = await apiClient.subscribe(streamRequest);
    expect(data.streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    // Verify it becomes active (stream start, not completion)
    const { data: activeStreams } = await apiClient.getActive();
    expect(activeStreams.activeStreams).toContain(data.streamId);

    // Stop stream (don't wait for completion of all 100 events)
    const { data: stopData } = await apiClient.stop(data.streamId);
    expect(stopData.streamId).toBe(data.streamId);

    // Verify removed
    const { data: finalStreams } = await apiClient.getActive();
    expect(finalStreams.activeStreams).not.toContain(data.streamId);
  });
});