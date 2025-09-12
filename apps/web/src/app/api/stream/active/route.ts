import { NextRequest, NextResponse } from 'next/server';
import { envWeb as env } from '@durablr/shared-utils-schemas/lib/env-web';
import { authService } from '@durablr/utils-auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 },
      );
    }
    const token = authHeader.split(' ')[1];

    const { valid, message } = await authService.validateUserToken(token);

    if (!valid) {
      return NextResponse.json({
        error: message,
        status: 401,
      });
    }
    const response = await fetch(`${env.API_URL}/stream/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authService.generateJwt(JSON.stringify({ valid: true }), env.SECRET_JWT_KEY)}`,
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
