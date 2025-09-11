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

  test.afterEach(async () => {
    // Global cleanup - stop any remaining streams
    try {
      const activeStreams = await apiClient.getActiveStreams();
      if (activeStreams.count > 0) {
        console.log(`🧹 Cleaning up ${activeStreams.count} remaining streams...`);
        await Promise.allSettled(
          activeStreams.activeStreams.map(id => apiClient.stopStream(id))
        );
      }
    } catch {
      // Ignore cleanup errors
    }
  });

  test('basic stream lifecycle', async () => {
    const streamRequest = createTestStreamRequest();

    // Create stream
    const { streamId } = await apiClient.subscribeToStream(streamRequest);
    expect(streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    // Verify active
    await apiClient.waitForStreamToBeActive(streamId);
    const activeStreams = await apiClient.getActiveStreams();
    expect(activeStreams.activeStreams).toContain(streamId);

    // Stop stream
    const stopResponse = await apiClient.stopStream(streamId);
    expect(stopResponse.streamId).toBe(streamId);

    // Verify removed
    await apiClient.waitForStreamToBeRemoved(streamId);
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

    const { streamId } = await apiClient.subscribeToStream(streamRequest);
    await apiClient.waitForStreamToBeActive(streamId);
    await apiClient.stopStream(streamId);
    await apiClient.waitForStreamToBeRemoved(streamId);
  });

  test('e2e data setup verification', async () => {
    // Verify that our seeded project ID exists by trying to create a stream
    const streamRequest = createTestStreamRequest();
    expect(streamRequest.projectId).toBe('prj_test_e2e_streaming');
    
    // This test will fail if the project doesn't exist in the database
    // due to foreign key constraint, which confirms our seeding worked
    const { streamId } = await apiClient.subscribeToStream(streamRequest);
    expect(streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    
    // Clean up the test stream
    await apiClient.stopStream(streamId);
  });

  test('long stream handling (100 events)', async () => {
    // Test with 100-event stream to verify handling of longer streams
    const streamRequest = createTestStreamRequest({
      streamUrl: 'https://httpbin.org/stream/100'
    });

    // Create stream
    const { streamId } = await apiClient.subscribeToStream(streamRequest);
    expect(streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    // Verify it becomes active quickly (stream start, not completion)
    await apiClient.waitForStreamToBeActive(streamId);
    const activeStreams = await apiClient.getActiveStreams();
    expect(activeStreams.activeStreams).toContain(streamId);

    // Stop stream (don't wait for completion of all 100 events)
    const stopResponse = await apiClient.stopStream(streamId);
    expect(stopResponse.streamId).toBe(streamId);

    // Verify removed
    await apiClient.waitForStreamToBeRemoved(streamId);
  });
});