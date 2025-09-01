import z from 'zod';

const ProjectStatus = z.enum(['active', 'paused', 'error']);

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: ProjectStatus,
});

export type Project = z.infer<typeof ProjectSchema>;
