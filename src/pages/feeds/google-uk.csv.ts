import type { APIRoute } from 'astro';
import { productFeedCsv } from '../../lib/product-feed';
import { shippingFeedValue } from '../../lib/seo';

export const prerender = true;

/** Google Merchant Center feed for the UK (feed label GB), in the pound prices the site charges there. */
export const GET: APIRoute = () =>
  productFeedCsv(['identifier_exists', 'shipping'], (cents) => ['no', shippingFeedValue(cents, 'GBP', ['GB'])], 'GBP');
