import { DataTable } from '@durablr/web-ui/server';
import { Stream } from '@durablr/shared-utils-schemas';
import { columns } from './components/stream-columns';
import { getStreams } from './loader';
import { ApiExamples } from './components/api-examples';

export async function DashboardPage({ projectId }: { projectId: string }) {
  const streams = await getStreams(projectId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-16">
        <ApiExamples projectId={projectId} />
        <DataTable<Stream>
          columns={columns}
          data={streams}
          title="Streams"
          description="Detailed view of streams"
          searchable
          searchPlaceholder="Search streams..."
        />
      </div>
    </div>
  );
}
