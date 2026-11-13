import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { site } from '../data/site';
import { packFor, productHref } from './lander-products';
import { toLocalCents, type Currency } from './currency';
import { CATEGORY_LABELS, GROUP_LABELS } from './products';
import { absoluteUrl, firstSentences } from './seo';

/** Google product taxonomy paths, which Pinterest also uses. */
const GOOGLE_CATEGORY: Record<string, string> = {
  bags: 'Apparel & Accessories > Handbags, Wallets & Cases > Handbags',
  hats: 'Apparel & Accessories > Clothing Accessories > Hats',
  coasters: 'Home & Garden > Kitchen & Dining > Barware > Coasters',
};

export const BASE_HEADERS = [
  'id', 'title', 'description', 'link', 'image_link', 'price', 'availability',
  'condition', 'brand', 'google_product_category', 'product_type', 'additional_image_link',
];

/** A product's lowest price in `currency`, as its page and the checkout charge it: a bundle page's
 * own single-pack price list, else the euro price converted (rounded up to .95). */
export function fromCents(slug: string, priceEur: number, currency: Currency): number {
  const pack = packFor(slug);
  if (pack && !pack.lander.sizes) return currency === 'GBP' ? pack.price.gbp : currency === 'USD' ? pack.price.usd : pack.price.eur;
  return toLocalCents(Math.round(priceEur * 100), currency);
}

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

/** One row per product at its lowest ("From") price, shared by the Pinterest and Google feeds.
 * No review columns: Etsy reviews are shop-level, not per product. `extra` adds columns. */
export async function productFeedCsv(
  extraHeaders: string[] = [],
  extra: (priceCents: number) => string[] = () => [],
  currency: Currency = 'EUR',
): Promise<Response> {
  const products = (await getCollection('products')).sort((a, b) => a.id.localeCompare(b.id));
  const rows = await Promise.all(
    products.map(async (p) => {
      const photo = async (src: ImageMetadata) => absoluteUrl((await getImage({ src, width: 1000, format: 'jpg' })).src);
      const [main, ...more] = p.data.images;
      const extras = await Promise.all(more.slice(0, 10).map((i) => photo(i.src)));
      const type = p.data.group ? `${CATEGORY_LABELS[p.data.category]} > ${GROUP_LABELS[p.data.group]}` : CATEGORY_LABELS[p.data.category];
      return [
        `SD-${p.id.toUpperCase()}`,
        p.data.seoTitle ?? p.data.name,
        firstSentences(p.body ?? '', 4),
        absoluteUrl(productHref(p.id)),
        await photo(main.src),
        `${(fromCents(p.id, p.data.price, currency) / 100).toFixed(2)} ${currency}`,
        p.data.inStock ? 'in stock' : 'out of stock',
        'new',
        site.name,
        GOOGLE_CATEGORY[p.data.category] ?? '',
        type,
        extras.join(','),
        ...extra(fromCents(p.id, p.data.price, currency)),
      ].map(cell).join(',');
    }),
  );
  const csv = [[...BASE_HEADERS, ...extraHeaders].join(','), ...rows].join('\r\n') + '\r\n';
  return new Response(csv, { headers: { 'content-type': 'text/csv; charset=utf-8' } });
}
