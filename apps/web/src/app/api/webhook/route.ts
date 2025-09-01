import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@stream-helper/feature-vercel';

export async function POST(request: NextRequest) {
  try {
    const body = await verifyWebhook(request);

    console.log('Webhook received:', {
      type: body.type,
      createdAt: body.createdAt,
      payload: body.payload,
    });

    // Handle different event types
    switch (body.type) {
      case 'integration-resource.project-connected': {
        // New integration installed
        console.log('Integration installed for:', body.payload);
        break;
      }
      case 'integration-configuration.removed': {
        console.log('integrations', body.payload.integrations);
        console.log('projects', body.payload.configuration.projects);
        break;
      }
      case 'integration-resource.project-disconnected': {
        // Integration uninstalled
        console.log('Integration removed for:', body.payload);
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
