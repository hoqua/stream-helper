import { eq } from 'drizzle-orm';
import { db } from '../client';
import { NewUser, users } from '../schema';

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
