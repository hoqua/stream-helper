import { test, expect } from '@playwright/test';
import { StreamApiClient } from './lib/api-client';
import { createTestStreamRequest, waitForStreamActive } from './lib/test-fixtures';
import { z } from 'zod';
import * as fs from 'fs';

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

    // Wait for stream to become active
    const streamActivated = await waitForStreamActive(apiClient, subData.streamId);
    expect(streamActivated).toBeTruthy();

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
    
    // Wait for stream to become active
    await waitForStreamActive(apiClient, data.streamId);
    
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
    
    // Wait for stream to become active
    await waitForStreamActive(apiClient, data.streamId);
    
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

    // Wait for stream to become active
    await waitForStreamActive(apiClient, data.streamId);

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

    // Wait for stream to become active
    await waitForStreamActive(apiClient, data.streamId);

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
    const activationTimes: number[] = [];

    // Helper function to add delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    console.log(`Starting stress test: creating ${totalStreams} streams with ${delayMs}ms delay`);
    console.log('Each stream will save log data and be verified for activation');

    const testStartTime = Date.now();

    // Create streams with delay and individual verification
    for (let i = 0; i < totalStreams; i++) {
      const streamRequest = createTestStreamRequest({
        webhookUrl: `https://httpbin.org/post?stream=${i}`,
        saveStreamData: true, // Enable data saving for stress test
      });

      const streamStartTime = Date.now();
      const { response, data } = await apiClient.subscribe(streamRequest);

      // Verify each stream is created successfully
      expect(response.ok(), `Stream ${i + 1} creation should succeed`).toBeTruthy();
      expect(z.uuid().safeParse(data.streamId).success, `Stream ${i + 1} should have valid UUID`).toBeTruthy();

      streamIds.push(data.streamId);

      // Wait for this specific stream to become active
      const streamActivated = await waitForStreamActive(apiClient, data.streamId);

      const streamActivationTime = Date.now();
      const timeTaken = streamActivationTime - streamStartTime;
      activationTimes.push(timeTaken);

      expect(streamActivated).toBeTruthy();

      // Log progress every 20 streams with timing info
      if ((i + 1) % 20 === 0) {
        const avgActivationTime = activationTimes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, activationTimes.length);
        console.log(`Created ${i + 1}/${totalStreams} streams (last 20 avg activation: ${avgActivationTime.toFixed(0)}ms)`);
      }

      // Add delay between stream creations
      await delay(delayMs);
    }

    const testEndTime = Date.now();
    const totalTestTime = testEndTime - testStartTime;

    // Calculate statistics
    const avgActivationTime = activationTimes.reduce((a, b) => a + b, 0) / activationTimes.length;
    const minActivationTime = Math.min(...activationTimes);
    const maxActivationTime = Math.max(...activationTimes);
    const p95ActivationTime = activationTimes.sort((a, b) => a - b)[Math.floor(activationTimes.length * 0.95)];

    // Final verification
    const { data: finalActiveData } = await apiClient.getActive();
    const ourActiveStreams = finalActiveData.activeStreams.filter((id: string) => streamIds.includes(id));

    const results = {
      totalStreams,
      successfulStreams: streamIds.length,
      activeStreams: ourActiveStreams.length,
      totalTestTimeMs: totalTestTime,
      totalTestTimeMin: (totalTestTime / 1000 / 60).toFixed(2),
      avgActivationTimeMs: avgActivationTime.toFixed(2),
      minActivationTimeMs: minActivationTime,
      maxActivationTimeMs: maxActivationTime,
      p95ActivationTimeMs: p95ActivationTime,
      streamsPerSecond: ((totalStreams / (totalTestTime / 1000)).toFixed(2)),
    };

    console.log('🚀 STRESS TEST RESULTS:');
    console.log(`✅ Created ${results.successfulStreams}/${results.totalStreams} streams successfully`);
    console.log(`📊 ${results.activeStreams} streams currently active`);
    console.log(`⏱️  Total test time: ${results.totalTestTimeMin} minutes`);
    console.log(`⚡ Average stream activation time: ${results.avgActivationTimeMs}ms`);
    console.log(`🏃 Streams per second: ${results.streamsPerSecond}`);
    console.log(`📈 Activation times - Min: ${results.minActivationTimeMs}ms, Max: ${results.maxActivationTimeMs}ms, P95: ${results.p95ActivationTimeMs}ms`);

    // Store results in testInfo for potential PR commenting
    testInfo.annotations.push({
      type: 'info',
      description: `Stress Test Results: ${results.successfulStreams}/${results.totalStreams} streams, ${results.avgActivationTimeMs}ms avg activation, ${results.streamsPerSecond} streams/sec`
    });

    // Save results to file for PR comment script
    try {
      fs.writeFileSync('./test-results.json', JSON.stringify(results, null, 2));
      console.log('📁 Test results saved to test-results.json');
    } catch (error) {
      console.warn('⚠️ Failed to save test results file:', error);
    }

    console.log('Stress test completed successfully - no cleanup performed');

    // Assertions
    expect(results.successfulStreams).toBe(totalStreams);
    expect(results.activeStreams).toBeGreaterThan(0);
    expect(parseFloat(results.avgActivationTimeMs)).toBeLessThan(5000); // Should activate within 5 seconds on average
  });
});