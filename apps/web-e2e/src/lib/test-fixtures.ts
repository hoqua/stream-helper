import type { StreamSubscribeRequest } from '@durablr/shared-utils-schemas';
import { retry } from 'radash';
import type { StreamApiClient } from './api-client';

export const TEST_PROJECT_ID = 'prj_test_e2e_streaming';

export const TEST_FIXTURES = {
  streamUrls: {
    veryLong: 'https://httpbin.org/stream/100', // 100 events - more reliable timing than stream/100
  },
  webhookUrls: {
    apiTest: `${process.env.API_URL || 'http://localhost:3001'}/test`,
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
    webhookUrl: TEST_FIXTURES.webhookUrls.apiTest,
    method: 'GET',
    projectId: TEST_PROJECT_ID,
    saveStreamData: false,
    ...overrides,
  };
}

/**
 * Waits for a stream to become active with retry logic
 */
export async function waitForStreamActive(
  apiClient: StreamApiClient,
  streamId: string,
  options: { times?: number; delay?: number } = {}
): Promise<boolean> {
  const { times = 5, delay = 200 } = options;
  
  return await retry(
    { times, delay },
    async () => {
      const { data: activeData } = await apiClient.getActive();
      if (activeData.activeStreams.includes(streamId)) {
        return true;
      }
      throw new Error(`Stream ${streamId} not yet active`);
    }
  );
}