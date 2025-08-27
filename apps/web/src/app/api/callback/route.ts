import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const configurationId = searchParams.get('configurationId');
  
  if (!code) {
    return NextResponse.redirect(new URL('/error?message=No%20code%20provided', request.url));
  }

  // Exchange the code for an access token
  const response = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_HOST}/api/callback`,
    }),
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL('/error?message=Failed%20to%20exchange%20code', request.url));
  }

  // In a real integration, you would store the access token securely
  // const data = await response.json();
  // Store data.access_token, data.user_id, etc.
  
  // For now, we'll just redirect to the configuration page
  
  if (configurationId) {
    // Redirect to configuration UI
    return NextResponse.redirect(new URL(`/configure?configurationId=${configurationId}`, request.url));
  }
  
  // If there's a next URL from Vercel, redirect there
  if (next) {
    return NextResponse.redirect(next);
  }
  
  // Default redirect to success
  return NextResponse.redirect(new URL('/success', request.url));
}