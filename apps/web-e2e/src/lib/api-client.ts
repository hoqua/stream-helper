import { APIRequestContext } from '@playwright/test';
import { rawKey } from './seed-e2e-data';

export class StreamApiClient {
  constructor(
    public request: APIRequestContext,
    private baseUrl: string,
  ) {}

  async subscribe(payload: any) {
    const response = await this.request.post(`${this.baseUrl}/api/stream/subscribe`, {
      data: payload,
      headers: {
        authorization: `Bearer ${rawKey}`,
      },
    });
    return { response, data: await response.json() };
  }

  async getActive() {
    const response = await this.request.get(`${this.baseUrl}/api/stream/active`, {
      headers: {
        authorization: `Bearer ${rawKey}`,
      },
    });
    return { response, data: await response.json() };
  }

  async stop(streamId: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/stream/subscribe/${streamId}`, {
      headers: {
        authorization: `Bearer ${rawKey}`,
      },
    });
    return { response, data: await response.json() };
  }
}

