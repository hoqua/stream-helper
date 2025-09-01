'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, cn } from '@stream-helper/web-ui/server';
import { statusConfig } from './constants';
import { Stream } from '@stream-helper/shared-utils-schemas';
import { format } from 'date-fns';

export const columns: ColumnDef<Stream>[] = [
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
    cell: ({ row }) => (
      <span className="text-sm text-gray-300 truncate">{row.getValue('streamUrl')}</span>
    ),
  },
  {
    accessorKey: 'eventType',
    header: 'Event Type',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-white truncate">{row.getValue('webhookUrl')}</span>
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
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <span className="text-sm text-gray-300">{format(date, 'dd.MM.yyyy HH:mm:ss')}</span>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return <span className="text-sm text-gray-300">{format(date, 'dd.MM.yyyy HH:mm:ss')}</span>;
    },
  },
];
