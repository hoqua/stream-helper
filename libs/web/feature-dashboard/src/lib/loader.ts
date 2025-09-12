'use server';
import {
  findUserById,
  getAllProjectStreams,
  getUserProjects,
} from '@durablr/shared-data-access-db';
import { getAuthUserIdOrThrow } from '@durablr/utils-auth';

export async function getStreams(projectId: string) {
  const userId = await getAuthUserIdOrThrow();
  return await getAllProjectStreams(projectId, userId);
}

export async function getProjects() {
  const userId = await getAuthUserIdOrThrow();

  return await getUserProjects(userId);
}

export async function findUser() {
  const userId = await getAuthUserIdOrThrow();
  return await findUserById(userId);
}
