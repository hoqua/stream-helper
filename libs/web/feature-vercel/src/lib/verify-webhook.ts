import { NextRequest } from 'next/server';
import * as crypto from 'node:crypto';

const CLIENT_SECRET = process.env.CLIENT_SECRET || '';

export async function verifyWebhook(request: NextRequest) {
  const rawBody = await request.text();
  const rawBodyBuffer = Buffer.from(rawBody, 'utf-8');
  const bodySignature = sha1(rawBodyBuffer, CLIENT_SECRET);

  if (bodySignature !== request.headers.get('x-vercel-signature')) {
    throw new Error('Invalid signature');
  }

  return JSON.parse(rawBodyBuffer.toString('utf-8'));
}

function sha1(data: Buffer, secret: string): string {
  return crypto
    .createHmac('sha1', secret)
    .update(new Uint8Array(data))
    .digest('hex');
}
