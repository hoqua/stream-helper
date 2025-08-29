import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@stream-helper/shared-data-access-db';
import { exchangeExternalCodeForToken } from '@stream-helper/feature-vercel';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const configurationId = searchParams.get('configurationId') || '';

  if (!code) {
    return NextResponse.redirect(
      new URL('/error?message=No%20code%20provided', request.url)
    );
  }

  const response = await exchangeExternalCodeForToken(
    code,
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/callback`
  );

  if (!response.success || !response.data) {
    return NextResponse.redirect(
      new URL(
        `/error?message=${response.error} + ${process.env.NEXT_PUBLIC_VERCEL_URL}`,
        request.url
      )
    );
  }

  const { data } = response;

  await createUser({
    id: data.user_id,
    accessToken: data.access_token,
    teamId: data.team_id,
    configurationId,
    installationId: data.installation_id,
  });

  // If there's a next URL from Vercel, redirect there
  if (next) {
    const nextUrl = new URL('/configure', request.url);
    nextUrl.searchParams.set('redirectUrl', next);
    nextUrl.searchParams.set('configurationId', configurationId);
    return NextResponse.redirect(nextUrl);
  }

  // Default redirect to success
  return NextResponse.redirect(new URL('/success', request.url));
}
