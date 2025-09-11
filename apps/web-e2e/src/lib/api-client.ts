import { APIRequestContext, expect } from '@playwright/test';
import type {
  StreamSubscribeRequest,
  StreamSubscribeResponse,
  ActiveStreamsResponse,
  StreamStopResponse,
} from '@durablr/shared-utils-schemas';

export class StreamApiClient {
  constructor(public request: APIRequestContext, private baseUrl: string) {}

  async subscribeToStream(
    payload: StreamSubscribeRequest
  ): Promise<StreamSubscribeResponse> {
    const response = await this.request.post(`${this.baseUrl}/api/stream/subscribe`, {
      data: payload,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data as StreamSubscribeResponse;
  }

  async getActiveStreams(): Promise<ActiveStreamsResponse> {
    const response = await this.request.get(`${this.baseUrl}/api/stream/active`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data as ActiveStreamsResponse;
  }

  async stopStream(streamId: string): Promise<StreamStopResponse> {
    const response = await this.request.delete(
      `${this.baseUrl}/api/stream/subscribe/${streamId}`
    );

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    return data as StreamStopResponse;
  }

  async waitForStreamToBeActive(streamId: string, timeoutMs = 10000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const activeStreams = await this.getActiveStreams();
      if (activeStreams.activeStreams.includes(streamId)) {
        return;
      }
      // Wait 500ms before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error(`Stream ${streamId} did not become active within ${timeoutMs}ms`);
  }

  async waitForStreamToBeRemoved(streamId: string, timeoutMs = 10000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const activeStreams = await this.getActiveStreams();
      if (!activeStreams.activeStreams.includes(streamId)) {
        return;
      }
      // Wait 500ms before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error(`Stream ${streamId} was not removed within ${timeoutMs}ms`);
  }
}