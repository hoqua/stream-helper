import z from 'zod';

export const IntegrationExternalTokenResponse = z.object({
  token_type: z.string(),
  access_token: z.string(),
  installation_id: z.string(),
  user_id: z.string(),
  team_id: z.string().nullable(),
});

export type IntegrationExternalTokenResponseType = z.infer<
  typeof IntegrationExternalTokenResponse
>;
