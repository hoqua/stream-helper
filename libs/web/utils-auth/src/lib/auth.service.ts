// import { createClerkClient } from '@clerk/nextjs/server';
import crypto from 'node:crypto';
// import { getKey } from '@durablr/shared-data-access-db';
//
// const clerkClient = createClerkClient({
//   secretKey: process.env.CLERK_SECRET_KEY,
// });

class AuthService {
  generateKey() {
    const rawKey = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    return { rawKey, hash };
  }

  // async validateUserToken(token: string) {
  //   try {
  //     const hash = crypto.createHash('sha256').update(token).digest('hex');
  //
  //     const key = await getKey(hash);
  //
  //     if (!key || !key.userId) {
  //       return {
  //         valid: false,
  //         message: 'Invalid Token',
  //       };
  //     }
  //
  //     const subscription = await clerkClient.billing.getUserBillingSubscription(key.userId);
  //
  //     if (subscription.status !== 'active') {
  //       return {
  //         valid: false,
  //         message: 'You must have an active subscription',
  //       };
  //     }
  //
  //     return {
  //       valid: true,
  //     };
  //   } catch {
  //     return {
  //       valid: false,
  //       message: 'Failed to validate api key',
  //     };
  //   }
  // }

  async validateUserToken(token: string) {
    return {
      valid: true,
      message: 'ok',
    };
  }
}

export const authService = new AuthService();
