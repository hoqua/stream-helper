import { eq } from 'drizzle-orm';
import { db } from '../client';
import { NewUser, users } from '../schema';

export async function createUser(data: NewUser) {
  return await db.insert(users).values(data).returning();
}

export async function findUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getAllUsers() {
  return await db.select().from(users);
}
