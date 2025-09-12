'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from '@durablr/web-ui/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ApiKeyForm, ApiKeyFromSchema } from '../schema';
import { addApiKey } from '../action';
import { usePathname } from 'next/navigation';

export function AddKeyForm() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApiKeyForm>({
    resolver: zodResolver(ApiKeyFromSchema),
  });

  const onSubmit = async (data: ApiKeyForm) => {
    setIsLoading(true);
    try {
      const newKey = await addApiKey({ name: data.name }, path);
      setApiKey(newKey);
      setIsOpen(true);
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (apiKey) {
      setIsOpen(false);
      setApiKey(null);
      reset();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">API Key Name</Label>
          <Input
            id="name"
            className="outline-none border-none bg-gray-800"
            {...register('name')}
            placeholder="e.g., Production Server"
            disabled={isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create API Key'}
        </Button>
      </form>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Your API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-400">
              Save this key somewhere secure. You won't be able to see it again after closing this
              dialog.
            </p>
            <div className="p-4 bg-gray-800 rounded-lg">
              <code className="text-sm font-mono text-green-400 break-all">{apiKey}</code>
            </div>
            <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-500 w-full">
              I've saved my key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
