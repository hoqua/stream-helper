import { OverviewMetrics } from '@stream-helper/shared-utils-schemas';
export const mockMetrics: OverviewMetrics = {
  totalEvents: 15_423,
  successRate: 98.7,
  activeStreams: 8,
  errorRate: 1.3,
};

export const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/10 bg-blue-500',
  green: 'bg-green-500/10 bg-green-500',
  purple: 'bg-purple-500/10 bg-purple-500',
  orange: 'bg-orange-500/10 bg-orange-500',
  red: 'bg-red-500/10 bg-red-500',
  cyan: 'bg-cyan-500/10 bg-cyan-500',
};

export const subtitleColors: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  cyan: 'text-cyan-400',
};

export const statusConfig: Record<string, string> = {
  active: 'bg-green-500',
  error: 'bg-red-500',
  stopped: 'bg-yellow-500',
  completed: 'bg-blue-500',
};
