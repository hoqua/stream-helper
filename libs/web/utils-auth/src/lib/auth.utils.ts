import { auth } from '@clerk/nextjs/server';

export async function getAuthUserIdOrThrow() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in!');
  }
  return userId;
}
