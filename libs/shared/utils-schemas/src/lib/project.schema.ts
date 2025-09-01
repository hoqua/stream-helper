import z from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
