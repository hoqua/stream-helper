import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StreamSubscribeRequestSchema } from '@durablr/shared-utils-schemas';
import { accessService } from '@durablr/feature-access-control';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  console.log('=== POST /api/stream/subscribe called ===');

  try {
    const rawBody = await request.json();

    // Validate request body using Zod
    const validatedBody = StreamSubscribeRequestSchema.parse(rawBody);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 },
      );
    }
    const token = authHeader.split(' ')[1];

    const { valid, message } = await accessService.validateUserToken(token);

    if (!valid) {
      return NextResponse.json(
        {
          error: message,
        },
        { status: 401 },
      );
    }

    const response = await fetch(`${env.API_URL}/stream/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${jwt.sign({ valid: true }, env.SECRET_JWT_KEY)}`,
      },
      body: JSON.stringify(validatedBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to subscribe to stream', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
