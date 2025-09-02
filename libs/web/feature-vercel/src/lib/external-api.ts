import { IntegrationExternalTokenResponse, IntegrationExternalTokenResponseType } from './schema';
import { envWeb } from '@durablr/shared-utils-schemas';

const CLIENT_ID = envWeb.CLIENT_ID;
const CLIENT_SECRET = envWeb.CLIENT_SECRET;

export async function exchangeExternalCodeForToken(
  code: string,
  redirectUri: string,
): Promise<{
  success: boolean;
  data?: IntegrationExternalTokenResponseType;
  error?: string;
}> {
  try {
    const response = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Error response from Vercel:', errorData);
      return {
        success: false,
        error: 'Failed to exchange code' + JSON.stringify(errorData, null, 2),
      };
    }

    const data = await response.json();

    const parsed = IntegrationExternalTokenResponse.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid response from Vercel',
      };
    }

    return {
      success: true,
      data: parsed.data,
    };
  } catch (error) {
    console.log('Error exchanging code for token:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
