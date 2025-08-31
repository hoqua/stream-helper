import { eq } from 'drizzle-orm';
import { db } from '../client';
import { NewUser, users } from '../schema';
import { ConfigurationType } from '@stream-helper/shared-utils-schemas';

export async function createUser(data: NewUser) {
  return await db.insert(users).values(data).returning();
}

export async function configureUser(id: string, data: ConfigurationType) {
  return await db.update(users).set(data).where(eq(users.configurationId, id));
}

export async function getAllUsers() {
  return await db.select().from(users);
}
