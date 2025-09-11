import { seedE2EData } from './lib/seed-e2e-data';

async function globalSetup(): Promise<void> {
  await seedE2EData();
}

export default globalSetup;