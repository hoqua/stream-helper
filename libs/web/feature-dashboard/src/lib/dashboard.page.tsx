import { mockMetrics } from './components/constants';
import MetricsGrid from './components/metric-cards';
import { DataTable } from '@stream-helper/web-ui/server';
import { Stream } from '@stream-helper/shared-utils-schemas';
import { columns } from './components/stream-columns';
import { getStreams } from './loader';

export async function DashboardPage({ projectId }: { projectId: string }) {
  const streams = await getStreams(projectId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Monitor your stream processing metrics and activity</p>
      </div>
      <MetricsGrid metrics={mockMetrics} />
      <DataTable<Stream>
        columns={columns}
        data={streams}
        title="Stream Processing Log"
        description="Detailed view of streams"
        searchable
        searchPlaceholder="Search streams..."
      />
    </div>
  );
}
