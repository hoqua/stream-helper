import { and, eq } from 'drizzle-orm';
import { db } from '../client';
import { apiKeys, NewApiKey, NewUser, users } from '../schema';

export async function createUser(userData: NewUser) {
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}

export async function findUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function addKey(data: NewApiKey) {
  const key = await db.insert(apiKeys).values(data).returning();
  return key[0];
}

export async function getKey(hash: string) {
  return await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.key, hash), eq(apiKeys.revoked, false)),
  });
}

export async function getKeys(userId: string) {
  return await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId));
}

export async function deleteKey(id: string) {
  return await db.delete(apiKeys).where(eq(apiKeys.id, id));
}
