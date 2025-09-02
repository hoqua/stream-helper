import { Vercel } from '@vercel/sdk';

export class VercelService {
  private client: Vercel | null = null;

  constructor(token: string) {
    this.client = new Vercel({ bearerToken: token });
  }

  async getUser() {
    return await this.client?.user.getAuthUser();
  }

  async getConfiguration(id: string, teamId?: string) {
    return await this.client?.integrations.getConfiguration({
      id,
      teamId,
    });
  }

  async getProjects(teamId?: string) {
    const data = await this.client?.projects.getProjects({ teamId });
    if (!data || !data.projects) {
      return [];
    }

    return data.projects;
  }

  async addEnvs(projectIds: string[], envs: Record<string, string>, teamId?: string) {
    await Promise.all(
      projectIds.map((projectId) =>
        this.client?.projects.createProjectEnv({
          idOrName: projectId,
          teamId,
          upsert: 'true',
          requestBody: Object.entries(envs).map(([key, value]) => ({
            key,
            value,
            target: ['production', 'preview', 'development'],
            type: 'encrypted',
          })),
        }),
      ),
    );
  }
}
