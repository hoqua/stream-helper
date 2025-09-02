import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';
import { StreamIdParamSchema } from '@durablr/shared-utils-schemas';

export async function DELETE(request: NextRequest, { params }: { params: { streamId: string } }) {
  try {
    // Validate streamId parameter using Zod
    const validatedParams = StreamIdParamSchema.parse(params);

    const response = await fetch(`${env.API_URL}/stream/subscribe/${validatedParams.streamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
