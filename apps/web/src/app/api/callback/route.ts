import { NextRequest, NextResponse } from 'next/server';
import {
  addKey,
  createOrganizationWithUser,
  createProjects,
  createUser,
  findUserById,
} from '@durablr/shared-data-access-db';
import { exchangeExternalCodeForToken, VercelService } from '@durablr/feature-vercel';
import { env } from '../../../env';
import { authService } from '@durablr/utils-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const configurationId = searchParams.get('configurationId');

  if (!code || !configurationId) {
    return NextResponse.redirect(new URL('/error?message=No%20code%20provided', request.url));
  }

  const response = await exchangeExternalCodeForToken(
    code,
    `https://${env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}/api/callback`,
  );

  if (!response.success || !response.data) {
    return NextResponse.redirect(new URL(`/error?message=${response.error}`, request.url));
  }

  const { data } = response;

  const vercelClient = new VercelService(data.access_token);

  const [existingUser, userData, projects] = await Promise.all([
    findUserById(data.user_id),
    vercelClient.getUser(),
    vercelClient.getProjects(data.team_id ?? undefined),
  ]);

  if (!userData || !projects) {
    return NextResponse.redirect(new URL(`/error?message=Unauthorized`, request.url));
  }

  const { username, email } = userData.user;

  if (!existingUser) {
    await createUser({
      id: data.user_id,
      username,
      email,
      teamId: data.team_id,
    });
  }

  const { rawKey, hash } = authService.generateKey();

  const [org] = await Promise.all([
    createOrganizationWithUser(data.user_id, {
      name: 'Vercel',
      accessToken: data.access_token,
      providerId: data.team_id || data.user_id,
      configurationId,
      installationId: data.installation_id,
    }),
    addKey({
      key: hash,
      userId: data.user_id,
      name: 'Vercel',
    }),
  ]);

  await Promise.all([
    createProjects(
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        orgId: org.id,
      })),
    ),
    vercelClient.addEnvs(
      projects.map((p) => p.id),
      {
        DURABLR_URL: env.API_URL,
        DURABLR_ACCESS_TOKEN: rawKey,
      },
      data.team_id ?? undefined,
    ),
  ]);

  // If there's a next URL from Vercel, redirect there
  if (next) {
    return NextResponse.redirect(next);
  }

  // Default redirect to success
  return NextResponse.redirect(new URL('/success', request.url));
}
