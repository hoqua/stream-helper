import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { StreamSubscribeRequestSchema } from '@durablr/shared-utils-schemas';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Validate request body using Zod
    const validatedBody = StreamSubscribeRequestSchema.parse(rawBody);

    const response = await fetch(`${env.API_URL}/stream/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    console.error('Error subscribing to stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
