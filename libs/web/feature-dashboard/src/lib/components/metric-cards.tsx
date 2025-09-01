import { colorClasses, subtitleColors } from './constants';
import { OverviewMetrics } from '@stream-helper/shared-utils-schemas';
import { cn } from '@stream-helper/web-ui/server';

interface Metric {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
}

export default function MetricsGrid({ metrics }: { metrics: OverviewMetrics }) {
  const metricsData: Metric[] = [
    {
      title: 'Total Events',
      value: metrics.totalEvents,
      subtitle: '+12% from yesterday',
      color: 'blue',
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate}%`,
      subtitle: 'Excellent performance',
      color: 'green',
    },
    {
      title: 'Avg Latency',
      value: `${metrics.avgLatency}ms`,
      subtitle: 'Within normal range',
      color: 'purple',
    },
    {
      title: 'Active Streams',
      value: metrics.activeStreams,
      subtitle: 'Currently processing',
      color: 'orange',
    },
    {
      title: 'Error Rate',
      value: `${metrics.errorRate}%`,
      subtitle: 'Needs attention',
      color: 'red',
    },
    {
      title: 'Throughput',
      value: `${metrics.throughput}/min`,
      subtitle: 'Events per minute',
      color: 'cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metricsData.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          color={metric.color as 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'}
        />
      ))}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
}) {
  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div
          className={cn(
            `w-8 h-8  rounded-lg flex items-center justify-center`,
            colorClasses[color].split(' ')[0],
          )}
        >
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              colorClasses[color].split(' ')[1],
              color === 'orange' && 'animate-pulse',
            )}
          ></div>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className={cn('text-xs', subtitleColors[color])}>{subtitle}</div>
    </div>
  );
}
