import { ReactNode } from 'react';
import Navbar from './components/navbar';
import { getProjects } from './loader';

export async function DashboardLayout({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  const projects = await getProjects();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <Navbar projects={projects} selectedProjectId={projectId} />

      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
