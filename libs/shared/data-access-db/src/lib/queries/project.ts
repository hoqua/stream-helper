import { eq, inArray, or } from 'drizzle-orm';
import { db } from '../client';
import { NewProject, organizations, Project, projects } from '../schema';

export async function createProject(data: NewProject[]): Promise<Project[]> {
  return await db.insert(projects).values(data).returning();
}

export async function getUserProjects(userId: string, teamId?: string): Promise<Project[]> {
  const data = await db
    .select({ project: projects })
    .from(projects)
    .innerJoin(organizations, eq(projects.orgId, organizations.id))
    .where(or(eq(organizations.userId, userId), eq(organizations.teamId, teamId || '')));

  return data.map((p) => p.project);
}

export async function deleteProjects(ids: string[]) {
  return await db.delete(projects).where(inArray(projects.id, ids));
}

export async function addMultipleProjects(data: NewProject[]) {
  if (!data || data.length === 0) return;
  await db.insert(projects).values(data);
}
