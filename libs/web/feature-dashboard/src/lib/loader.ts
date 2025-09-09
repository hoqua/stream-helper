'use server';
import { getAllProjectStreams, getUserProjects } from '@durablr/shared-data-access-db';
import { auth } from '@clerk/nextjs/server';

export async function getStreams(projectId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized: User not found');

  return await getAllProjectStreams(projectId, userId);
}

export async function getProjects() {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized: User not found');

  return await getUserProjects(userId);
}
