'use server';
import { configureUser } from '@stream-helper/shared-data-access-db';
import { ConfigurationType } from '@stream-helper/shared-utils-schemas';
import { redirect } from 'next/navigation';

export async function updateConfiguration(
  configurationId: string,
  redirectUrl: string,
  data: ConfigurationType,
) {
  await configureUser(configurationId, data);

  redirect(redirectUrl);
}
