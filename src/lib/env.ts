import { env } from 'cloudflare:workers';
import type { D1Like } from './orders';
import { validateEnv } from './env-validate';

export interface SunnieEnv {
  ORDERS: D1Like;
  ASSETS: { fetch(req: Request): Promise<Response> };
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_ENV: 'sandbox' | 'live';
  RESEND_API_KEY: string;
  BAG_SECRET: string;
  ORDER_NOTIFY_EMAIL: string;
  ORDER_FROM_EMAIL: string;
}

export { validateEnv };

export function getEnv(): SunnieEnv {
  validateEnv(env as unknown as Record<string, unknown>);
  return env as unknown as SunnieEnv;
}
