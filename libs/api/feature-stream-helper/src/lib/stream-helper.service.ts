import { createStream, updateStreamStatus } from '@durablr/shared-data-access-db';
import { retry } from 'radash';

export interface StreamConfig {
  streamUrl: string;
  projectId: string;
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
  private readonly processors = new Map<string, StreamProcessor>();
  private readonly MAX_CONCURRENT_STREAMS = 10_000;
  private readonly WEBHOOK_TIMEOUT = 10_000; // 10 seconds
  private readonly WEBHOOK_RETRY_CONFIG = {
    times: 3,
    delay: 1000,
    backoff: (attempts: number) => attempts * 1000, // 1s, 2s, 3s
  };
  private logger: any = console; // Default to console, can be overridden with setLogger

  private metricsInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMetricsLogging();
  }

  public setLogger(logger: any): void {
    this.logger = logger;
    // Restart metrics logging with new logger
    this.startMetricsLogging();
  }

  private startMetricsLogging(): void {
    // Clear existing interval if any
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Log active streams every 30 seconds
    this.metricsInterval = setInterval(() => {
      const utilizationPercent = (
        (this.processors.size / this.MAX_CONCURRENT_STREAMS) *
        100
      ).toFixed(2);
      this.logger.info(
        {
          activeStreams: this.processors.size,
          maxStreams: this.MAX_CONCURRENT_STREAMS,
          utilizationPercent,
        },
        'Stream metrics',
      );
    }, 30_000);
  }

  async subscribeToStream(config: StreamConfig): Promise<string> {
    // Check capacity limit
    if (this.processors.size >= this.MAX_CONCURRENT_STREAMS) {
      throw new Error(
        `Maximum concurrent streams limit reached (${this.MAX_CONCURRENT_STREAMS}). Please try again later.`,
      );
    }

    const streamId = crypto.randomUUID();

    // Create database record
    await createStream({
      id: streamId,
      projectId: config.projectId,
      streamUrl: config.streamUrl,
      webhookUrl: config.webhookUrl,
      status: 'active',
    });

    // Create processor
    const processor: StreamProcessor = {
      config,
      streamId,
      abortController: new AbortController(),
    };
    this.processors.set(streamId, processor);

    // Start processing in background
    this.processStream(processor)
      .catch(async (error) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error({ streamId, error: errorMessage }, 'Stream processing failed');
        await updateStreamStatus(streamId, 'error', errorMessage);
      })
      .finally(() => {
        this.processors.delete(streamId);
      });

    return streamId;
  }

  private async processStream(processor: StreamProcessor): Promise<void> {
    const { config, streamId, abortController } = processor;

    // Make HTTP request to stream URL
    const fetchOptions: RequestInit = {
      method: config.method,
      headers: {
        Accept: 'text/event-stream',
        ...config.headers,
      },
      signal: abortController.signal,
      body: config.body ? JSON.stringify(config.body) : undefined,
    };

    const response = await fetch(config.streamUrl, fetchOptions);

    if (!response.ok) {
      const errorMessage = `Stream failed with status ${response.status}`;
      await updateStreamStatus(streamId, 'error', errorMessage);
      throw new Error(errorMessage);
    }

    if (!response.body) return;

    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      // Read chunks and send to webhook
      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        await this.sendWebhookWithRetry(config.webhookUrl, {
          streamId,
          type: 'chunk',
          data: decoder.decode(value),
          timestamp: new Date().toISOString(),
        });
      }

      // Send completion notification
      await this.sendWebhookWithRetry(config.webhookUrl, {
        streamId,
        type: 'completed',
        timestamp: new Date().toISOString(),
      });

      await updateStreamStatus(streamId, 'completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await updateStreamStatus(streamId, 'error', errorMessage);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }

  private async sendWebhookWithRetry(webhookUrl: string, data: WebhookPayload): Promise<void> {
    try {
      await retry(this.WEBHOOK_RETRY_CONFIG, async () => {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(this.WEBHOOK_TIMEOUT),
        });

        if (!response.ok) {
          throw new Error(`Webhook failed with status ${response.status}`);
        }
      });
    } catch (error) {
      // Webhook failed after all retries - stop the stream
      const baseError = error instanceof Error ? error.message : 'Unknown error';
      const errorMessage = `Webhook delivery failed after ${this.WEBHOOK_RETRY_CONFIG.times} retries: ${baseError}`;

      this.logger.error(
        { webhookUrl, streamId: data.streamId, error: errorMessage },
        'Webhook delivery failed after all retries - stopping stream',
      );

      // Update database and cleanup stream
      await updateStreamStatus(data.streamId, 'error', errorMessage);
      const processor = this.processors.get(data.streamId);
      if (processor) {
        processor.abortController.abort();
        this.processors.delete(data.streamId);
      }

      throw new Error(errorMessage);
    }
  }

  async stopStream(streamId: string): Promise<boolean> {
    const processor = this.processors.get(streamId);
    if (!processor) return false;

    processor.abortController.abort();
    this.processors.delete(streamId);
    await updateStreamStatus(streamId, 'stopped');
    return true;
  }

  getActiveStreams(): string[] {
    return [...this.processors.keys()];
  }
}

export const streamService = new StreamHelperService();
