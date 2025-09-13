import { getOrCreateTestUser } from './lib/clerk-client';
import { seedE2EData } from './lib/seed-e2e-data';

async function globalSetup(): Promise<void> {
  const user = await getOrCreateTestUser('test-e2e@example.com');
  const { rawKey, userId } = await seedE2EData(user.id);

  process.env.DURABLR_TOKEN = rawKey;
  process.env.STATE_USER = userId;
}

export default globalSetup;
