import type { APIRoute } from 'astro';
import { productFeedCsv } from '../../lib/product-feed';
import { shippingFeedValue } from '../../lib/seo';

export const prerender = true;

/** Google Merchant Center feed for the US (feed label US), in the dollar prices the site charges there. */
export const GET: APIRoute = () =>
  productFeedCsv(['identifier_exists', 'shipping'], (cents) => ['no', shippingFeedValue(cents, 'USD', ['US'])], 'USD');
