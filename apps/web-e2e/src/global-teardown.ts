import { deleteClerkUser } from './lib/clerk-client';
import { deleteDbUser } from './lib/seed-e2e-data';

async function globalTeardown() {
  try {
    const userId = process.env.STATE_USER;
    if (!userId) {
      console.warn('Failed to delete user, user id is undefined');
      return;
    }

    await Promise.all([deleteDbUser(userId), deleteClerkUser(userId)]);
  } catch (err) {
    console.warn('Failed to delete test user:', err);
  }
}

export default globalTeardown;
