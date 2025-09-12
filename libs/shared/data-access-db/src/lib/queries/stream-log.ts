import { eq } from 'drizzle-orm';
import { db } from '../client';
import { NewStreamLog, StreamLog, streamLogs } from '../schema';

export async function createStreamLog(data: NewStreamLog): Promise<StreamLog[]> {
  return db.insert(streamLogs).values(data).returning();
}

export async function getStreamLogs(streamId: string): Promise<StreamLog[]> {
  return db.select().from(streamLogs).where(eq(streamLogs.streamId, streamId));
}

export async function deleteStreamLogs(streamId: string): Promise<void> {
  await db.delete(streamLogs).where(eq(streamLogs.streamId, streamId));
}
