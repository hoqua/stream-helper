'use server';
import { configureUser } from '@durablr/shared-data-access-db';
import { ConfigurationType } from '@durablr/shared-utils-schemas';
import { redirect } from 'next/navigation';

export async function updateConfiguration(
  configurationId: string,
  redirectUrl: string,
  data: ConfigurationType,
) {
  await configureUser(configurationId, data);

  redirect(redirectUrl);
}
