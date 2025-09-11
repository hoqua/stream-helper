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
});