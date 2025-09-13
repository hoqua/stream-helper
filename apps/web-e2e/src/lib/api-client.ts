import { APIRequestContext } from '@playwright/test';

export class StreamApiClient {
  private headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.DURABLR_TOKEN}`,
  };
  constructor(
    public request: APIRequestContext,
    private baseUrl: string,
  ) {}

  async subscribe(payload: any) {
    const response = await this.request.post(`${this.baseUrl}/api/stream/subscribe`, {
      data: payload,
      headers: this.headers,
    });
    return { response, data: await response.json() };
  }

  async getActive() {
    const response = await this.request.get(`${this.baseUrl}/api/stream/active`, {
      headers: this.headers,
    });
    return { response, data: await response.json() };
  }

  async stop(streamId: string) {
    const response = await this.request.delete(`${this.baseUrl}/api/stream/subscribe/${streamId}`, {
      headers: this.headers,
    });
    return { response, data: await response.json() };
  }

  async getStreamLogs(streamId: string) {
    const response = await this.request.get(`${this.baseUrl}/api/stream/${streamId}/logs`, {
      headers: this.headers,
    });
    return { response, data: await response.json() };
  }
}

