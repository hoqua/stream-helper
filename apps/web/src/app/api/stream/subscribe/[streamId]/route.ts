import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';
import { StreamIdParamSchema } from '@durablr/shared-utils-schemas';
import { accessService } from '@durablr/feature-access-control';
import jwt from 'jsonwebtoken';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ streamId: string }> }) {
  try {
    // Validate streamId parameter using Zod
    const validatedParams = StreamIdParamSchema.parse(await params);

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
      return NextResponse.json({
        error: message,
        status: 401,
      });
    }

    const response = await fetch(`${env.API_URL}/stream/subscribe/${validatedParams.streamId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${jwt.sign({ valid: true }, env.SECRET_JWT_KEY)}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to stop stream', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error, { status: 400 });
    }

    console.error('Error stopping stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
