import type { StreamSubscribeRequest } from '@durablr/shared-utils-schemas';

// Test project ID (safe for testing)
export const TEST_PROJECT_ID = 'prj_test_e2e_streaming';

// Safe test endpoints that return predictable responses
export const TEST_FIXTURES = {
  // HTTPBin streaming endpoints - safe for testing
  streamUrls: {
    short: 'https://httpbin.org/stream/3',    // 3 events - quick test
    medium: 'https://httpbin.org/stream/5',   // 5 events - standard test
    long: 'https://httpbin.org/stream/10',    // 10 events - extended test
  },
  
  // Safe webhook endpoints for testing
  webhookUrls: {
    webhookSite: 'https://webhook.site/test-e2e',
    httpbinPost: 'https://httpbin.org/post',
    requestCatcher: 'https://requestcatcher.com/test-e2e',
  },
} as const;

/**
 * Creates a basic stream subscription request for testing
 */
export function createTestStreamRequest(
  overrides: Partial<StreamSubscribeRequest> = {}
): StreamSubscribeRequest {
  return {
    streamUrl: TEST_FIXTURES.streamUrls.short,
    webhookUrl: TEST_FIXTURES.webhookUrls.httpbinPost,
    method: 'GET',
    projectId: TEST_PROJECT_ID,
    ...overrides,
  };
}

/**
 * Creates an OpenAI-style streaming request for advanced testing
 */
export function createOpenAIStyleTestRequest(
  overrides: Partial<StreamSubscribeRequest> = {}
): StreamSubscribeRequest {
  return {
    method: 'POST',
    streamUrl: 'https://httpbin.org/post', // Safe endpoint that accepts POST
    webhookUrl: TEST_FIXTURES.webhookUrls.httpbinPost,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      model: 'test-model',
      messages: [{ role: 'user', content: 'Test message for E2E' }],
      stream: true,
      max_tokens: 10,
    },
    projectId: TEST_PROJECT_ID,
    ...overrides,
  };
}