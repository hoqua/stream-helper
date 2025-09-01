import { eq } from 'drizzle-orm';
import { db } from '../client';
import { NewStream, Stream, streams, streamStatusEnum } from '../schema';

export async function createStream(data: NewStream): Promise<Stream[]> {
  return await db.insert(streams).values(data).returning();
}

export async function updateStreamStatus(
  id: string,
  status: (typeof streamStatusEnum.enumValues)[number],
  errorMessage?: string,
): Promise<Stream[]> {
  const updateData: Partial<Pick<Stream, 'status' | 'errorMessage' | 'updatedAt'>> = {
    status,
    updatedAt: new Date(),
  };

  if (errorMessage !== undefined) {
    updateData.errorMessage = errorMessage;
  }

  return await db.update(streams).set(updateData).where(eq(streams.id, id)).returning();
}

export async function getStreamById(id: string): Promise<Stream | undefined> {
  const result = await db.select().from(streams).where(eq(streams.id, id));
  return result[0];
}

export async function getActiveStreams(): Promise<Stream[]> {
  return await db.select().from(streams).where(eq(streams.status, 'active'));
}

export async function getAllStreams(): Promise<Stream[]> {
  return await db.select().from(streams);
}
