import type { APIRoute } from 'astro';
import { productFeedCsv } from '../../lib/product-feed';

export const prerender = true;

/** Pinterest catalog feed, rebuilt with the site so it always matches the product pages. */
export const GET: APIRoute = () => productFeedCsv();
