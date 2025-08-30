import { Vercel } from '@vercel/sdk';

export class VercelService {
  private client: Vercel | null = null;

  constructor(token: string) {
    this.client = new Vercel({ bearerToken: token });
  }

  async addEnvs(projectId: string, envs: Record<string, string>) {
    await this.client?.projects.createProjectEnv({
      idOrName: projectId,
      upsert: 'true',
      requestBody: Object.entries(envs).map(([key, value]) => ({
        key,
        value,
        target: ['production', 'preview', 'development'],
        type: 'encrypted',
      })),
    });
  }
}
