import { OverviewMetrics, Project, Metric } from '@stream-helper/shared-utils-schemas';
export const mockProjects: Project[] = [
  { id: '1', name: 'production-api', status: 'active' },
  { id: '2', name: 'staging-frontend', status: 'active' },
  { id: '3', name: 'demo-app', status: 'paused' },
];

export const mockMetrics: OverviewMetrics = {
  totalEvents: 15_423,
  successRate: 98.7,
  avgLatency: 234,
  activeStreams: 8,
  errorRate: 1.3,
  throughput: 1250,
};

export const mockMetricData: Metric[] = [
  {
    id: 'evt_001',
    projectId: '1',
    timestamp: '2025-01-30 14:23:15',
    eventType: 'webhook.received',
    status: 'success',
    duration: 156,
    source: 'vercel-deploy',
    destination: 'stream-processor',
    dataSize: '2.4 KB',
  },
  {
    id: 'evt_002',
    projectId: '2',
    timestamp: '2025-01-30 14:22:45',
    eventType: 'data.transform',
    status: 'success',
    duration: 892,
    source: 'stream-processor',
    destination: 'analytics-db',
    dataSize: '15.2 KB',
  },
  {
    id: 'evt_003',
    projectId: '3',
    timestamp: '2025-01-30 14:22:12',
    eventType: 'webhook.received',
    status: 'error',
    duration: 3421,
    source: 'vercel-deploy',
    destination: 'stream-processor',
    dataSize: '1.8 KB',
  },
  {
    id: 'evt_004',
    projectId: '4',
    timestamp: '2025-01-30 14:21:58',
    eventType: 'data.validation',
    status: 'warning',
    duration: 234,
    source: 'stream-processor',
    destination: 'validator',
    dataSize: '5.7 KB',
  },
  {
    id: 'evt_005',
    projectId: '5',
    timestamp: '2025-01-30 14:21:33',
    eventType: 'stream.connect',
    status: 'success',
    duration: 67,
    source: 'client',
    destination: 'stream-processor',
    dataSize: '0.3 KB',
  },
];

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
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  processing: 'bg-blue-500',
};
