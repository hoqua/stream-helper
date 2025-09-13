import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function getOrCreateTestUser(email: string) {
  // 1️⃣ Check if user exists
  const existingUsers = await clerkClient.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  if (existingUsers.data.length > 0) {
    return existingUsers.data[0]; // Return existing user
  }

  // 2️⃣ Create a new test user
  const newUser = await clerkClient.users.createUser({
    emailAddress: [email],
    password: 'TestUser123!',
    skipPasswordChecks: true,
    skipPasswordRequirement: true,
  });

  return newUser;
}

export async function deleteClerkUser(userId: string) {
  await clerkClient.users.deleteUser(userId);
}
