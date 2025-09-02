import { NextRequest, NextResponse } from 'next/server';
import { VercelService, verifyWebhook } from '@durablr/feature-vercel';
import {
  addMultipleProjects,
  deleteProjects,
  deleteUserByConfigurationId,
  getUserByConfigurationId,
} from '@durablr/shared-data-access-db';

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
      case 'integration-configuration.permission-upgraded': {
        const data = body.payload;
        const user = await getUserByConfigurationId(data.configuration.id);
        const vercelClient = new VercelService(user[0].accessToken);
        const projects = await vercelClient.getProjects(data.team.id);
        const projectsToAdd = projects.filter((p) => data.projects.added.includes(p.id));
        await Promise.all([
          addMultipleProjects(
            projectsToAdd.map((p) => ({
              id: p.id,
              name: p.name,
              userId: user[0].id,
            })),
          ),
          deleteProjects(data.projects.removed),
        ]);
        break;
      }
      case 'integration-resource.project-connected': {
        // New integration installed
        console.log('Integration installed for:', body.payload);
        break;
      }
      case 'integration-configuration.removed': {
        await deleteUserByConfigurationId(body.payload.configuration.id);
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
