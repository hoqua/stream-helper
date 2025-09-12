import jwt from 'jsonwebtoken';
import { envApi } from '@durablr/shared-utils-schemas/lib/env-api';

export function validateAccessToken(accessToken: string) {
  if (!accessToken.startsWith('Bearer ')) {
    return false;
  }

  const value = accessToken.split(' ')[1];
  const decodedToken = jwt.verify(value, envApi.SECRET_JWT_KEY) as { valid: boolean };

  return decodedToken.valid;
}
