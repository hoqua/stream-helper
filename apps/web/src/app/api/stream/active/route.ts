import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.API_URL}/stream/active`, {
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
