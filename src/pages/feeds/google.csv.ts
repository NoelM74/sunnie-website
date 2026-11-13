import type { APIRoute } from 'astro';
import { productFeedCsv } from '../../lib/product-feed';
import { shippingFeedValue } from '../../lib/seo';

export const prerender = true;

/** Google Merchant Center feed: the Pinterest columns plus no-barcode (handmade, no GTIN)
 * and per-country shipping with delivery times, the same as the product pages' structured data. */
export const GET: APIRoute = () =>
  productFeedCsv(['identifier_exists', 'shipping'], (price) => ['no', shippingFeedValue(price)]);
