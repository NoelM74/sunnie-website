import type { APIRoute } from 'astro';
import { productFeedCsv } from '../../lib/product-feed';
import { shippingFeedValue } from '../../lib/seo';
import { COUNTRY_CODES } from '../../lib/checkout-form';

export const prerender = true;

/** Google Merchant Center feed in euro (feed label IE): every country we ship to except the UK and US,
 * which have their own feeds in pounds and dollars. Adds no-barcode (handmade, no GTIN) and per-country
 * shipping with delivery times, the same as the product pages' structured data. */
export const EURO_COUNTRIES = COUNTRY_CODES.filter((c) => c !== 'GB' && c !== 'US');
export const GET: APIRoute = () =>
  productFeedCsv(['identifier_exists', 'shipping'], (cents) => ['no', shippingFeedValue(cents, 'EUR', EURO_COUNTRIES)]);
