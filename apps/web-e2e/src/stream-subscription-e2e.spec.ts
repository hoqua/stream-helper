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

  test('stress test: create 100 streams with 50ms delay', async ({ }, testInfo) => {
    testInfo.setTimeout(60 * 60 * 1000); // 1 hour timeout
    const streamIds: string[] = [];
    const totalStreams = 100;
    const delayMs = 50;
    
    // Helper function to add delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    console.log(`Starting stress test: creating ${totalStreams} streams with ${delayMs}ms delay`);
    
    // Create streams with delay
    for (let i = 0; i < totalStreams; i++) {
      const streamRequest = createTestStreamRequest({
        webhookUrl: `https://httpbin.org/post?stream=${i}`,
      });
      
      const { response, data } = await apiClient.subscribe(streamRequest);
      
      // Verify each stream is created successfully
      expect(response.ok(), `Stream ${i + 1} creation should succeed`).toBeTruthy();
      expect(data.streamId, `Stream ${i + 1} should have valid ID`).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
      
      streamIds.push(data.streamId);
      
      // Log progress every 100 streams
      if ((i + 1) % 100 === 0) {
        console.log(`Created ${i + 1}/${totalStreams} streams`);
      }
      
      // Add delay between stream creations
      await delay(delayMs);
    }
    
    console.log(`Successfully created ${totalStreams} streams`);
    
    // Verify all streams are active
    const { data: activeData } = await apiClient.getActive();
    for (const streamId of streamIds) {
      expect(activeData.activeStreams).toContain(streamId);
    }
    
    console.log('All streams verified as active');
    
    // Clean up: stop all created streams
    console.log('Cleaning up: stopping all streams');
    for (let i = 0; i < streamIds.length; i++) {
      await apiClient.stop(streamIds[i]);
      
      // Log cleanup progress every 100 streams
      if ((i + 1) % 100 === 0) {
        console.log(`Stopped ${i + 1}/${totalStreams} streams`);
      }
    }
    
    console.log('Stress test completed successfully');
  });
});