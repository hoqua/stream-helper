import { DashboardPage } from '@durablr/web-feature-dashboard/server';

export default async function Dashboard({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <DashboardPage projectId={projectId} />;
}
