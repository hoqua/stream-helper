import { NextRequest, NextResponse } from 'next/server';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${env.API_URL}/stream/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to get active streams', details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting active streams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
