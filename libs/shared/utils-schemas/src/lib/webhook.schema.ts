import z from 'zod';

export const DefaultWebhookSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
  team: z.object({
    id: z.string(),
  }),
  installationIds: z.array(z.string()),
  integrations: z.array(
    z.object({
      installationId: z.string(),
    }),
  ),
});

export const ProjectsSchema = z.array(z.string());

export const ConfigurationRemovedSchema = DefaultWebhookSchema.extend({
  configuration: z.object({
    id: z.string(),
    projectSelection: 'selected',
    projects: z.array(z.string()),
  }),
});

export const PermisionUpgradedSchema = DefaultWebhookSchema.extend({
  configuration: z.object({
    id: z.string(),
    projectSelection: 'selected',
    projects: z.array(z.string()),
  }),
  projects: z.object({ added: ProjectsSchema, removed: ProjectsSchema }),
});
