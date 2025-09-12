import { APIRequestContext } from '@playwright/test';
import { rawKey } from './seed-e2e-data';

const headers =  {
  authorization: `Bearer ${rawKey}`,
}

export class StreamApiClient {
  constructor(public request: APIRequestContext, private baseUrl: string) {}

  async subscribe(payload: any) {
    const response = await this.request.post(`${this.baseUrl}/api/stream/subscribe`, { data: payload, headers });
    return { response, data: await response.json() };
  }

  async getActive() {
    const response = await this.request.get(`${this.baseUrl}/api/stream/active`, { headers });
    return { response, data: await response.json() };
  }

  async stop(streamId: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/stream/subscribe/${streamId}`, { headers });
    return { response, data: await response.json() };
  }

  async getStreamLogs(streamId: string) {
    const response = await this.request.get(`${this.baseUrl}/api/stream/${streamId}/logs`, { headers });
    return { response, data: await response.json() };
  }
}