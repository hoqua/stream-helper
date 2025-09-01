'use server';
import { getAllProjectStreams, getUserProjects } from '@stream-helper/shared-data-access-db';

export async function getStreams(projectId: string) {
  return await getAllProjectStreams(projectId);
}

export async function getProjects() {
  const userId = 'mockuserId'; //TODO: GET USERID FROM SESSION

  return getUserProjects(userId);
}
