'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, cn } from '@durablr/web-ui/server';
import { statusConfig } from './constants';
import { Stream } from '@durablr/shared-utils-schemas';
import { format } from 'date-fns';

export const columns: ColumnDef<Stream>[] = [
  {
    accessorKey: 'id',
    header: 'Stream ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-gray-300">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'streamUrl',
    header: 'Stream URL',
    cell: ({ row }) => (
      <span className="text-sm text-gray-300 truncate max-w-48">{row.getValue('streamUrl')}</span>
    ),
  },
  {
    accessorKey: 'webhookUrl',
    header: 'Webhook URL',
    cell: ({ row }) => (
      <span className="text-sm text-gray-300 truncate max-w-48">{row.getValue('webhookUrl')}</span>
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
    accessorKey: 'errorMessage',
    header: 'Error Message',
    cell: ({ row }) => {
      const errorMessage = row.getValue('errorMessage') as string;
      return errorMessage ? (
        <span className="text-sm text-red-300 truncate max-w-48">{errorMessage}</span>
      ) : (
        <span className="text-sm text-gray-500">-</span>
      );
    },
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
