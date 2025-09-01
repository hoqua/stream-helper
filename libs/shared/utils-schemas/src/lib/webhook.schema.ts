import z from 'zod';

export const ConfigurationRemovedSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
  team: z.object({
    id: z.string(),
  }),
  installationIds: z.array(z.string()),
  integrations: z.array(z.object({}).loose()),
  configuration: z.object({
    id: z.string(),
    projectSelection: 'selected',
    projects: z.array(z.string()),
  }),
});
