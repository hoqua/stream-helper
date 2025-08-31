export interface StreamConfig {
  streamUrl: string;
  webhookUrl: string;
  headers?: Record<string, string>;
  body?: any;
  method?: string;
}

interface StreamProcessor {
  config: StreamConfig;
  streamId: string;
  abortController: AbortController;
}

export class StreamHelperService {
  private processors = new Map<string, StreamProcessor>();

  async subscribeToStream(config: StreamConfig): Promise<string> {
    const streamId = crypto.randomUUID();

    const abortController = new AbortController();
    const processor: StreamProcessor = {
      config,
      streamId,
      abortController,
    };

    this.processors.set(streamId, processor);

    // Start processing in background
    this.processStream(processor)
      .catch((error) => {
        console.error(`Stream ${streamId} failed:`, error.message);
      })
      .finally(() => {
        this.processors.delete(streamId);
      });

    return streamId;
  }

  private async processStream(processor: StreamProcessor): Promise<void> {
    const { config, streamId, abortController } = processor;

    const headers = {
      Accept: 'text/event-stream',
      ...config.headers,
    };

    const fetchOptions: RequestInit = {
      method: config.method || 'GET',
      headers,
      signal: abortController.signal,
    };

    if (
      config.body &&
      (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')
    ) {
      fetchOptions.body =
        typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
    }

    const response = await fetch(config.streamUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Stream failed: ${response.status}`);
    }

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // Just send whatever we got - no parsing, no trimming
        await this.sendWebhook(config.webhookUrl, {
          streamId,
          type: 'chunk',
          data: chunk,
          timestamp: new Date().toISOString(),
        });
      }

      // Send completion when stream ends
      await this.sendWebhook(config.webhookUrl, {
        streamId,
        type: 'completed',
        timestamp: new Date().toISOString(),
      });
    } finally {
      reader.releaseLock();
    }
  }

  private async sendWebhook(webhookUrl: string, data: any): Promise<void> {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Webhook failed:', error);
      // Continue processing even if webhook fails
    }
  }

  stopStream(streamId: string): boolean {
    const processor = this.processors.get(streamId);
    if (!processor) return false;

    processor.abortController.abort();
    this.processors.delete(streamId);
    return true;
  }

  getActiveStreams(): string[] {
    return [...this.processors.keys()];
  }
}

export const streamService = new StreamHelperService();
