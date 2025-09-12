'use server';
import { getAuthUserIdOrThrow } from '@durablr/utils-auth';
import { getKeys } from '@durablr/shared-data-access-db';

export async function getUserKeys() {
  const userId = await getAuthUserIdOrThrow();
  return await getKeys(userId);
}
