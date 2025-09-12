import type { StreamSubscribeRequest } from '@durablr/shared-utils-schemas';

// Test project ID (safe for testing)
export const TEST_PROJECT_ID = 'prj_test_e2e_streaming';

// Safe test endpoints that return predictable responses
export const TEST_FIXTURES = {
  // HTTPBin streaming endpoints - safe for testing
  streamUrls: {
    veryLong: 'https://httpbin.org/stream/100', // 100 events - stress test
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
    streamUrl: TEST_FIXTURES.streamUrls.veryLong,
    webhookUrl: TEST_FIXTURES.webhookUrls.httpbinPost,
    method: 'GET',
    projectId: TEST_PROJECT_ID,
    saveStreamData: false,
    ...overrides,
  };
}