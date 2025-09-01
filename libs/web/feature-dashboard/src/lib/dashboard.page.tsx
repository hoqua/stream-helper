import { mockMetrics } from './components/constants';
import MetricsGrid from './components/metric-cards';
import { DataTable } from '@stream-helper/web-ui/server';
import { Stream } from '@stream-helper/shared-utils-schemas';
import { columns } from './components/stream-columns';
import { getStreams } from './loader';

export async function DashboardPage({ projectId }: { projectId: string }) {
  const streams = await getStreams(projectId);

  const total = streams.length;
  const active = streams.filter((s) => s.status === 'active').length;
  const completed = streams.filter((s) => s.status === 'completed').length;
  const errored = streams.filter((s) => s.status === 'error').length;

  const successRate = total > 0 ? (completed / total) * 100 : 0;
  const errorRate = total > 0 ? (errored / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Monitor your stream processing metrics and activity</p>
      </div>
      <div className="flex flex-col gap-16">
        <MetricsGrid
          metrics={{
            totalStreams: streams.length,
            activeStreams: active,
            successRate,
            errorRate,
          }}
        />
        <DataTable<Stream>
          columns={columns}
          data={streams}
          title="Stream Processing Log"
          description="Detailed view of streams"
          searchable
          searchPlaceholder="Search streams..."
        />
      </div>
    </div>
  );
}
