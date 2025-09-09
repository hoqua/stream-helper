import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import {
  createUser,
  findUserById,
  createOrganization,
  createProject,
  getUserProjects,
} from '@durablr/shared-data-access-db';
import { generateProjectName } from '@durablr/web-feature-dashboard/server';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ redirect: '/sign-in' });

  const user = await currentUser();
  if (!user) return NextResponse.json({ redirect: '/sign-in' });

  const existing = await findUserById(user.id);

  if (!existing) {
    const newUser = await createUser({
      id: user.id,
      username: user.fullName,
      email: user.emailAddresses[0].emailAddress,
    });

    const orgId = crypto.randomUUID();
    const [_, project] = await Promise.all([
      createOrganization({ id: orgId, userId: newUser[0].id, name: 'Personal Account' }),
      createProject([{ name: generateProjectName(), orgId }]),
    ]);

    return NextResponse.json({ redirect: `/dashboard/${project[0].id}` });
  }

  const projects = await getUserProjects(existing.id);
  return NextResponse.json({ redirect: `/dashboard/${projects[0].id}` });
}
