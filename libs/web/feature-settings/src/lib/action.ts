'use server';
import { ApiKeyForm } from './schema';
import { addKey, deleteKey } from '@durablr/shared-data-access-db';
import { revalidatePath } from 'next/cache';
import { getAuthUserIdOrThrow, authService } from '@durablr/utils-auth';

export async function addApiKey(data: ApiKeyForm, path: string) {
  const userId = await getAuthUserIdOrThrow();
  const { rawKey, hash } = authService.generateKey();
  await addKey({
    name: data.name,
    key: hash,
    userId,
  });

  revalidatePath(path);

  return rawKey;
}

export async function deleteApiKey(id: string, path: string) {
  await deleteKey(id);
  revalidatePath(path);
}
