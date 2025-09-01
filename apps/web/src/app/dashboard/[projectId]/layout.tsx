import { DashboardLayout } from '@stream-helper/web-feature-dashboard/server';
import { ReactNode } from 'react';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ projectId: string }>;
  children: ReactNode;
}) {
  const { projectId } = await params;
  return <DashboardLayout projectId={projectId}>{children}</DashboardLayout>;
}
