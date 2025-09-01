import { eq, inArray } from 'drizzle-orm';
import { db } from '../client';
import { NewProject, Project, projects } from '../schema';

export async function createProject(data: NewProject[]): Promise<Project[]> {
  return await db.insert(projects).values(data).returning();
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  return await db.select().from(projects).where(eq(projects.userId, userId));
}

export async function deleteProjects(ids: string[]) {
  return await db.delete(projects).where(inArray(projects.id, ids));
}

export async function addMultipleProjects(data: NewProject[]) {
  if (!data || data.length === 0) return;
  await db.insert(projects).values(data);
}
