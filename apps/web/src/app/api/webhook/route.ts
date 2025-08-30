import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@stream-helper/feature-vercel';

export async function POST(request: NextRequest) {
  try {
    const body = await verifyWebhook(request);

    if (!body || !body.valid) {
      return NextResponse.json({ error: body?.error }, { status: 400 });
    }

    console.log('Webhook received:', {
      type: body.type,
      createdAt: body.createdAt,
      payload: body.payload,
    });

    // Handle different event types
    switch (body.type) {
      case 'integration.configuration-created': {
        // New integration installed
        console.log('Integration installed for:', body.payload?.userId);
        break;
      }

      case 'integration.configuration-removed': {
        // Integration uninstalled
        console.log('Integration removed for:', body.payload?.userId);
        break;
      }

      case 'deployment.created': {
        // Deployment created
        console.log('Deployment created:', body.payload?.deployment?.url);
        break;
      }

      default: {
        console.log('Unknown event type:', body.type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
