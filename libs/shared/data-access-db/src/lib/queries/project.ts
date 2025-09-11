import { eq, inArray } from 'drizzle-orm';
import { db } from '../client';
import { NewProject, organizations, Project, projects, userOrganizations } from '../schema';

export async function createProjects(data: NewProject[]): Promise<Project[]> {
  return await db.insert(projects).values(data).returning();
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const data = await db
    .select({ project: projects })
    .from(projects)
    .innerJoin(organizations, eq(projects.orgId, organizations.id))
    .innerJoin(userOrganizations, eq(userOrganizations.orgId, organizations.id))
    .where(eq(userOrganizations.userId, userId));

  return data.map((p) => p.project);
}

export async function deleteProjects(ids: string[]) {
  return await db.delete(projects).where(inArray(projects.id, ids));
}

export async function addMultipleProjects(data: NewProject[]) {
  if (!data || data.length === 0) return;
  await db.insert(projects).values(data);
}
