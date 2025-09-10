import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  createUser,
  findUserById,
  createProject,
  getUserProjects,
  createOrganizationWithUser,
} from '@durablr/shared-data-access-db';
import { generateProjectName } from '@durablr/web-feature-dashboard/server';

export async function GET() {
  const [session, user] = await Promise.all([auth(), currentUser()]);

  if (!session.userId || !user) return NextResponse.json({ redirect: '/sign-in' });

  const existing = await findUserById(user.id);

  if (!existing) {
    await createUser({
      id: user.id,
      username: user.fullName,
      email: user.emailAddresses[0].emailAddress,
    });

    const org = await createOrganizationWithUser(user.id, {
      name: 'Personal Account',
      providerId: user.id,
    });

    const project = await createProject([{ name: generateProjectName(), orgId: org.id }]);

    return NextResponse.json({ redirect: `/dashboard/${project[0].id}` });
  }

  const projects = await getUserProjects(existing.id);
  return NextResponse.json({ redirect: `/dashboard/${projects[0].id}` });
}
