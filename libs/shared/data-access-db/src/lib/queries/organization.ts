import { eq, and } from 'drizzle-orm';
import { NewOrganization, organizations } from '../schema';
import { db } from '../client';

export async function createOrganization(data: NewOrganization) {
  return await db.insert(organizations).values(data).returning();
}

export async function getOrganizationByConfigurationId(id: string) {
  return await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.configurationId, id)));
}

export async function deleteOrganizationByConfigurationId(id: string) {
  return await db.delete(organizations).where(and(eq(organizations.configurationId, id)));
}
