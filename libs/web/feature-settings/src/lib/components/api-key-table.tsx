'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from '@durablr/web-ui/server';
import { Trash2 } from 'lucide-react';
import { ApiKey } from '../schema';
import { deleteApiKey } from '../action';
import { useTransition } from 'react';
import { usePathname } from 'next/navigation';

export function ApiKeyTable({ data }: { data: ApiKey[] }) {
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteApiKey(id, path);
    });
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No API keys found</p>
        <p className="text-sm mt-2">Create your first API key to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-medium text-white">{apiKey.name}</TableCell>
              <TableCell className="text-gray-400">
                {format(new Date(apiKey.createdAt), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(apiKey.id)}
                  disabled={isPending}
                  className="focus:bg-none focus:border-none text-white bg-red-600 hover:bg-red-500 cursor-pointer hover:outline-none rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
