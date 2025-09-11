import { test, expect } from '@playwright/test';
import { StreamApiClient } from './lib/api-client';
import { createTestStreamRequest } from './lib/test-fixtures';

test.describe('Stream Subscription E2E', () => {
  let apiClient: StreamApiClient;
  let baseUrl: string;

  test.beforeEach(async ({ request, baseURL }) => {
    baseUrl = baseURL || 'http://localhost:3000';
    apiClient = new StreamApiClient(request, baseUrl);
  });

  test('stream subscription via web gateway fetch calls', async () => {
    // 1. Create stream (like register-stream.ts line 102-110)
    const streamRequest = createTestStreamRequest({
      streamUrl: 'https://httpbin.org/stream/5',
      webhookUrl: 'https://webhook.site/test-e2e-playwright',
    });

    console.log('🔄 Creating stream subscription...');
    const createResponse = await apiClient.subscribeToStream(streamRequest);
    
    expect(createResponse.streamId).toBeDefined();
    expect(createResponse.streamId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    
    const streamId = createResponse.streamId;
    console.log(`✅ Stream created with ID: ${streamId}`);

    // 2. Verify stream is active (like register-stream.ts line 130-131)
    console.log('🔍 Verifying stream is active...');
    await apiClient.waitForStreamToBeActive(streamId);
    
    const activeStreams = await apiClient.getActiveStreams();
    expect(activeStreams.activeStreams).toContain(streamId);
    expect(activeStreams.count).toBeGreaterThanOrEqual(1);
    console.log(`✅ Stream ${streamId} is active (${activeStreams.count} total streams)`);

    // 3. Stop stream (like register-stream.ts line 176-178)
    console.log('🛑 Stopping stream...');
    const stopResponse = await apiClient.stopStream(streamId);
    
    expect(stopResponse.message).toBeDefined();
    expect(stopResponse.streamId).toBe(streamId);
    console.log(`✅ ${stopResponse.message}`);

    // 4. Verify cleanup (verify stream is removed)
    console.log('🔍 Verifying stream cleanup...');
    await apiClient.waitForStreamToBeRemoved(streamId);
    
    const finalActiveStreams = await apiClient.getActiveStreams();
    expect(finalActiveStreams.activeStreams).not.toContain(streamId);
    console.log('✅ Stream successfully removed from active streams');
  });

  test('handles invalid stream URLs gracefully', async () => {
    const invalidRequest = createTestStreamRequest({
      streamUrl: 'not-a-valid-url',
    });

    // Should fail validation
    const response = await apiClient.request.post(`${baseUrl}/api/stream/subscribe`, {
      data: invalidRequest,
    });

    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData).toBeDefined();
  });

  test('handles invalid webhook URLs gracefully', async () => {
    const invalidRequest = createTestStreamRequest({
      webhookUrl: 'invalid-webhook-url',
    });

    // Should fail validation
    const response = await apiClient.request.post(`${baseUrl}/api/stream/subscribe`, {
      data: invalidRequest,
    });

    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData).toBeDefined();
  });

  test('handles missing project ID', async () => {
    const incompleteRequest = {
      streamUrl: 'https://httpbin.org/stream/3',
      webhookUrl: 'https://webhook.site/test',
      // missing projectId
    };

    const response = await apiClient.request.post(`${baseUrl}/api/stream/subscribe`, {
      data: incompleteRequest,
    });

    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData).toBeDefined();
  });

  test('complex stream request with headers and body', async () => {
    // Test POST request with headers and body (like OpenAI style)
    const complexRequest = createTestStreamRequest({
      method: 'POST',
      streamUrl: 'https://httpbin.org/post', // Safe endpoint for POST
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
        'X-Test-Header': 'e2e-testing',
      },
      body: {
        model: 'test-model',
        messages: [{ role: 'user', content: 'E2E test message' }],
        stream: true,
        max_tokens: 5,
      },
    });

    console.log('🔄 Creating complex stream with headers and body...');
    const createResponse = await apiClient.subscribeToStream(complexRequest);
    const streamId = createResponse.streamId;
    
    try {
      // Verify it was created
      await apiClient.waitForStreamToBeActive(streamId);
      console.log(`✅ Complex stream ${streamId} created successfully`);
      
      // Clean up
      await apiClient.stopStream(streamId);
      await apiClient.waitForStreamToBeRemoved(streamId);
      console.log('✅ Complex stream cleaned up successfully');
    } catch (error) {
      // Clean up even if test fails
      try {
        await apiClient.stopStream(streamId);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  });

  test('concurrent stream subscriptions', async () => {
    const streamIds: string[] = [];

    try {
      // Create 3 streams concurrently
      console.log('🔄 Creating 3 concurrent streams...');
      const promises = [
        apiClient.subscribeToStream(createTestStreamRequest({ 
          streamUrl: 'https://httpbin.org/stream/3',
          webhookUrl: 'https://webhook.site/concurrent-test-1' 
        })),
        apiClient.subscribeToStream(createTestStreamRequest({ 
          streamUrl: 'https://httpbin.org/stream/4',
          webhookUrl: 'https://webhook.site/concurrent-test-2' 
        })),
        apiClient.subscribeToStream(createTestStreamRequest({ 
          streamUrl: 'https://httpbin.org/stream/2',
          webhookUrl: 'https://webhook.site/concurrent-test-3' 
        })),
      ];

      const responses = await Promise.all(promises);
      streamIds.push(...responses.map(r => r.streamId));

      // Verify all streams are active
      await Promise.all(streamIds.map(id => apiClient.waitForStreamToBeActive(id)));
      
      const activeStreams = await apiClient.getActiveStreams();
      streamIds.forEach(id => {
        expect(activeStreams.activeStreams).toContain(id);
      });
      
      console.log(`✅ All ${streamIds.length} concurrent streams are active`);

      // Clean up all streams
      console.log('🧹 Cleaning up concurrent streams...');
      await Promise.all(streamIds.map(id => apiClient.stopStream(id)));
      
      // Verify all are removed
      await Promise.all(streamIds.map(id => apiClient.waitForStreamToBeRemoved(id)));
      
      const finalActiveStreams = await apiClient.getActiveStreams();
      streamIds.forEach(id => {
        expect(finalActiveStreams.activeStreams).not.toContain(id);
      });
      
      console.log('✅ All concurrent streams cleaned up successfully');
    } catch (error) {
      // Clean up any remaining streams
      console.log('🧹 Emergency cleanup of streams...');
      await Promise.allSettled(
        streamIds.map(async id => {
          try {
            await apiClient.stopStream(id);
          } catch {
            // Ignore errors during emergency cleanup
          }
        })
      );
      throw error;
    }
  });
});