import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StreamSubscribeRequestSchema } from '@durablr/shared-utils-schemas';
import { authService } from '@durablr/utils-auth';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  console.log('=== POST /api/stream/subscribe called ===');
  
  try {
    const rawBody = await request.json();
    console.log('Raw body received:', rawBody);

    // Validate request body using Zod
    const validatedBody = StreamSubscribeRequestSchema.parse(rawBody);
    console.log('Body validated successfully');

    const authHeader = request.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Auth failed: no bearer token');
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 },
      );
    }
    const token = authHeader.split(' ')[1];

    const { valid, message } = await authService.validateUserToken(token);
    console.log('Token validation result:', { valid, message });

    if (!valid) {
      console.log('Auth failed: invalid token');
      return NextResponse.json({
        error: message,
        status: 401,
      });
    }

    console.log('Making API call to:', `${env.API_URL}/stream/subscribe`);
    const response = await fetch(`${env.API_URL}/stream/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwt.sign({ valid: true }, env.SECRET_JWT_KEY)}`,
      },
      body: JSON.stringify(validatedBody),
    });

    console.log('API response status:', response.status);
    console.log('API response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('API error data:', errorData);
      return NextResponse.json(
        { error: 'Failed to subscribe to stream', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log('SUCCESS - subscribe response:', data);
    console.log('=== POST /api/stream/subscribe completed ===');
    return NextResponse.json(data);
  } catch (error) {
    console.log('Exception caught:', error);
    if (error instanceof ZodError) {
      console.log('Zod validation error:', error);
      return NextResponse.json(error, { status: 400 });
    }

    console.error('Error subscribing to stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
