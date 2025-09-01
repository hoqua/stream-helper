import { mockMetrics } from './components/constants';
import MetricsGrid from './components/metric-cards';
import { DataTable } from '@stream-helper/web-ui/server';
import { Metric } from '@stream-helper/shared-utils-schemas';
import { columns } from './components/metrics-columns';
import { mockMetricData } from './components/constants';

export function DashboardPage({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Monitor your stream processing metrics and activity</p>
      </div>
      <MetricsGrid metrics={mockMetrics} />
      <DataTable<Metric>
        columns={columns}
        data={mockMetricData}
        title="Event Processing Log"
        description="Detailed view of stream processing events and their metrics"
        searchable
        searchPlaceholder="Search events..."
      />
    </div>
  );
}
