import {
  users, 
  organizations, 
  userOrganizations, 
  projects,
  streams,
  db
} from '@durablr/shared-data-access-db';
import { eq } from 'drizzle-orm';

const E2E_USER_ID = 'user_test_e2e';
const E2E_ORG_ID = 'org_test_e2e';  
const E2E_PROJECT_ID = 'prj_test_e2e_streaming';
const E2E_ORG_NAME = 'E2E Test Organization';
const E2E_PROJECT_NAME = 'E2E Test Project';

export async function seedE2EData() {
  try {
    // Upsert user
    await db.insert(users).values({
      id: E2E_USER_ID,
      email: 'test-e2e@example.com',
      username: 'e2e-tester',
      teamId: null
    }).onConflictDoNothing();

    // Upsert organization
    await db.insert(organizations).values({
      id: E2E_ORG_ID,
      name: E2E_ORG_NAME,
      providerId: E2E_ORG_ID, // Use org ID as providerId to ensure uniqueness
      accessToken: null,
      configurationId: null,
      installationId: null
    }).onConflictDoNothing();

    // Upsert user-organization link
    await db.insert(userOrganizations).values({
      userId: E2E_USER_ID,
      orgId: E2E_ORG_ID
    }).onConflictDoNothing();

    // Upsert project
    await db.insert(projects).values({
      id: E2E_PROJECT_ID,
      orgId: E2E_ORG_ID,
      name: E2E_PROJECT_NAME
    }).onConflictDoNothing();

    // Clean up test streams
    await db.delete(streams).where(eq(streams.projectId, E2E_PROJECT_ID));
    
    console.log(`E2E data ready: ${E2E_PROJECT_ID}`);
  } catch (error) {
    console.error('E2E seed failed:', error);
    throw error;
  }
}