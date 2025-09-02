import { NextRequest, NextResponse } from 'next/server';
import { createProject, createUser } from '@durablr/shared-data-access-db';
import { exchangeExternalCodeForToken, VercelService } from '@durablr/feature-vercel';
import { env } from '../../../env';
import * as jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const configurationId = searchParams.get('configurationId') || '';
  const teamId = searchParams.get('teamId') || '';

  if (!code) {
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

  const [userData, projects] = await Promise.all([
    vercelClient.getUser(),
    vercelClient.getProjects(teamId),
  ]);

  console.log('UserData', userData);

  if (!userData || !projects) {
    return NextResponse.redirect(new URL(`/error?message=Unauthorized`, request.url));
  }

  const { username, email } = userData.user;

  const newUser = await createUser({
    externalId: data.user_id,
    username,
    email,
    accessToken: data.access_token,
    teamId: data.team_id,
    configurationId,
    installationId: data.installation_id,
  });

  const token = jwt.sign(newUser[0].id, env.SECRET_JWT_KEY);

  await Promise.all([
    createProject(
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        userId: newUser[0].id,
      })),
    ),
    vercelClient.addEnvs(
      projects.map((p) => p.id),
      {
        DURABLR_TOKEN: token,
        DURABLR_URL: env.STREAM_URL,
      },
      teamId,
    ),
  ]);

  // If there's a next URL from Vercel, redirect there
  if (next) {
    return NextResponse.redirect(next);
  }

  // Default redirect to success
  return NextResponse.redirect(new URL('/success', request.url));
}
