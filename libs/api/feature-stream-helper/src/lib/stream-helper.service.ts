import { createStream, updateStreamStatus } from '@stream-helper/shared-data-access-db';

export interface StreamConfig {
  streamUrl: string;
  webhookUrl: string;
  headers?: Record<string, string>;
  body?: unknown;
  method?: string;
}

interface WebhookPayload {
  streamId: string;
  type: 'chunk' | 'completed';
  data?: string;
  timestamp: string;
}

interface StreamProcessor {
  config: StreamConfig;
  streamId: string;
  abortController: AbortController;
}

export class StreamHelperService {
  private processors = new Map<string, StreamProcessor>();

  constructor() {
    // Log active streams count every 5 seconds
    setInterval(() => {
      console.log(`[${new Date().toISOString()}] Active streams: ${this.processors.size}`);
    }, 5000);
  }

  async subscribeToStream(config: StreamConfig): Promise<string> {
    const streamId = crypto.randomUUID();

    // Create stream record in database
    await createStream({
      id: streamId,
      streamUrl: config.streamUrl,
      webhookUrl: config.webhookUrl,
      status: 'active',
    });

    const abortController = new AbortController();
    const processor: StreamProcessor = {
      config,
      streamId,
      abortController,
    };

    this.processors.set(streamId, processor);

    // Start processing in background
    this.processStream(processor)
      .catch(async (error) => {
        console.error(`Stream ${streamId} failed:`, error.message);
        await updateStreamStatus(streamId, 'error', error.message);
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
      const errorMessage = `Stream failed: ${response.status}`;
      await updateStreamStatus(streamId, 'error', errorMessage);
      throw new Error(errorMessage);
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

      // Update database status to completed
      await updateStreamStatus(streamId, 'completed');
    } catch (error) {
      // Handle reading errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await updateStreamStatus(streamId, 'error', errorMessage);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }

  private async sendWebhook(webhookUrl: string, data: WebhookPayload): Promise<void> {
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

  async stopStream(streamId: string): Promise<boolean> {
    const processor = this.processors.get(streamId);
    if (!processor) return false;

    processor.abortController.abort();
    this.processors.delete(streamId);

    // Update database status to stopped
    await updateStreamStatus(streamId, 'stopped');
    return true;
  }

  getActiveStreams(): string[] {
    return [...this.processors.keys()];
  }
}

export const streamService = new StreamHelperService();
