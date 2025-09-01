'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, cn } from '@stream-helper/web-ui/server';
import { statusConfig } from './constants';
import { Metric } from '@stream-helper/shared-utils-schemas';

export const columns: ColumnDef<Metric>[] = [
  {
    accessorKey: 'id',
    header: 'Event ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-300">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => <span className="text-sm text-gray-300">{row.getValue('timestamp')}</span>,
  },
  {
    accessorKey: 'eventType',
    header: 'Event Type',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-white">{row.getValue('eventType')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={cn(statusConfig[row.getValue('status') as string])}>
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => <span className="text-sm text-gray-300">{row.getValue('duration')}ms</span>,
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => <span className="text-sm text-gray-300">{row.getValue('source')}</span>,
  },
  {
    accessorKey: 'destination',
    header: 'Destination',
    cell: ({ row }) => <span className="text-sm text-gray-300">{row.getValue('destination')}</span>,
  },
  {
    accessorKey: 'dataSize',
    header: 'Data Size',
    cell: ({ row }) => <span className="text-sm text-gray-300">{row.getValue('dataSize')}</span>,
  },
];
