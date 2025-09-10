import { eq, and } from 'drizzle-orm';
import { NewOrganization, organizations, userOrganizations } from '../schema';
import { db } from '../client';

export async function createOrganizationWithUser(userId: string, data: NewOrganization) {
  const org = await db.insert(organizations).values(data).returning();

  await db.insert(userOrganizations).values({
    userId,
    orgId: org[0].id,
  });

  return org[0];
}

export async function attachUserToOrganization(userId: string, orgId: string) {
  const exists = await db
    .select()
    .from(userOrganizations)
    .where(and(eq(userOrganizations.userId, userId), eq(userOrganizations.orgId, orgId)));

  if (exists.length === 0) {
    await db.insert(userOrganizations).values({
      userId,
      orgId,
    });
  }
}

export async function getOrganizationByProviderId(providerId: string) {
  const org = await db.select().from(organizations).where(eq(organizations.providerId, providerId));
  return org[0];
}

export async function getOrganizationByConfigurationId(id: string) {
  const org = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.configurationId, id)));

  return org[0];
}

export async function deleteOrganizationByConfigurationId(configurationId: string) {
  const org = await db
    .select()
    .from(organizations)
    .where(eq(organizations.configurationId, configurationId))
    .limit(1)
    .then((res) => res[0]);

  if (!org) return;

  await Promise.all([
    db.delete(userOrganizations).where(eq(userOrganizations.orgId, org.id)),
    db.delete(organizations).where(eq(organizations.id, org.id)),
  ]);
}
