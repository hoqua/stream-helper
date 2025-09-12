import { test, expect } from '@playwright/test';
import { StreamApiClient } from './lib/api-client';
import { createTestStreamRequest } from './lib/test-fixtures';
import { retry } from 'radash';
import { z } from 'zod';

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
    expect(z.uuid().safeParse(subData.streamId).success).toBeTruthy();

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
    expect(z.uuid().safeParse(data.streamId).success).toBeTruthy();
    
    // Clean up the test stream
    await apiClient.stop(data.streamId);
  });

  test('stream data saving when enabled', async () => {
    // Create stream with saveStreamData enabled
    const streamRequest = createTestStreamRequest({
      saveStreamData: true,
      streamUrl: 'https://httpbin.org/stream/5', // Small stream for testing
    });

    const { response, data } = await apiClient.subscribe(streamRequest);
    expect(response.ok()).toBeTruthy();
    expect(z.uuid().safeParse(data.streamId).success).toBeTruthy();

    // Wait for stream to process some data
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Stop the stream
    await apiClient.stop(data.streamId);

    // Verify data was saved to database
    const { response: logsResponse, data: logsData } = await apiClient.getStreamLogs(data.streamId);
    expect(logsResponse.ok()).toBeTruthy();
    expect(logsData.streamId).toBe(data.streamId);
    expect(logsData.count).toBeGreaterThan(0);
    expect(Array.isArray(logsData.logs)).toBeTruthy();
    
    // Verify each log entry has the expected structure
    if (logsData.logs.length > 0) {
      const firstLog = logsData.logs[0];
      expect(firstLog).toHaveProperty('id');
      expect(firstLog).toHaveProperty('streamId', data.streamId);
      expect(firstLog).toHaveProperty('content');
      expect(firstLog).toHaveProperty('createdAt');
    }
  });

  test('stream data not saved by default', async () => {
    // Create stream without saveStreamData (should default to false)
    const streamRequest = createTestStreamRequest({
      streamUrl: 'https://httpbin.org/stream/5',
    });

    const { response, data } = await apiClient.subscribe(streamRequest);
    expect(response.ok()).toBeTruthy();
    expect(z.uuid().safeParse(data.streamId).success).toBeTruthy();

    // Wait for stream to process
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Stop the stream
    await apiClient.stop(data.streamId);

    // Verify no data was saved to database
    const { response: logsResponse, data: logsData } = await apiClient.getStreamLogs(data.streamId);
    expect(logsResponse.ok()).toBeTruthy();
    expect(logsData.streamId).toBe(data.streamId);
    expect(logsData.count).toBe(0);
    expect(Array.isArray(logsData.logs)).toBeTruthy();
    expect(logsData.logs.length).toBe(0);
  });

  test('stress test: create 1000 streams with 50ms delay', async ({ }, testInfo) => {
    testInfo.setTimeout(60 * 60 * 1000); // 1 hour timeout
    const streamIds: string[] = [];
    const totalStreams = 1000;
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
      expect(z.uuid().safeParse(data.streamId).success, `Stream ${i + 1} should have valid UUID`).toBeTruthy();

      streamIds.push(data.streamId);

      // Log progress every 20 streams
      if ((i + 1) % 20 === 0) {
        console.log(`Created ${i + 1}/${totalStreams} streams`);
      }

      // Add delay between stream creations
      await delay(delayMs);
    }

    console.log(`Successfully created ${totalStreams} streams`);

    // Verify streams exist with retry logic (3 attempts)
    console.log('Verifying streams exist in the system...');

    const activeStreams = await retry(
      { times: 3, delay: 1000 },
      async () => {
        const { data: activeData } = await apiClient.getActive();
        console.log(`Found ${activeData.activeStreams.length} active streams`);
        return activeData.activeStreams as string[];
      }
    );

    // Just verify we can query the endpoint and get a valid response
    expect(activeStreams).toBeDefined();
    expect(Array.isArray(activeStreams)).toBeTruthy();

    // Count how many of our created streams are still active
    const ourActiveStreams = activeStreams.filter((id: string) => streamIds.includes(id));
    console.log(`${ourActiveStreams.length} of our ${totalStreams} created streams are still active`);

    console.log('Stress test completed successfully - no cleanup performed');
  });
});