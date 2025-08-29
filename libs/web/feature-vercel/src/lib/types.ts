export interface VercelOAuthTokenResponse {
  access_token: string;
  installation_id: string;
  team_id: string | null;
  user_id: string;
}
