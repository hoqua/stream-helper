'use server';
import { getAllProjectStreams, getAllUsers, getUserProjects } from '@durablr/shared-data-access-db';

export async function getStreams(projectId: string) {
  return await getAllProjectStreams(projectId);
}

export async function getProjects() {
  //!: GET USERID FROM SESSION
  const users = await getAllUsers();
  if (users.length === 0) {
    return [];
  }
  const userId = users[0].id;

  return getUserProjects(userId);
}
