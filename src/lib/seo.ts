import { site } from '../data/site';

export const BRAND_SUFFIX = ` | ${site.name}`;
const MAX_TITLE = 60;

export function pageTitle(title: string): string {
  return title === site.name ? title : `${title}${BRAND_SUFFIX}`;
}

export function productTitle(name: string): string {
  const long = `${name}, handmade crochet${BRAND_SUFFIX}`;
  if (long.length <= MAX_TITLE) return long;
  const short = `${name}${BRAND_SUFFIX}`;
  if (short.length <= MAX_TITLE) return short;
  const room = MAX_TITLE - BRAND_SUFFIX.length - 1;
  return `${name.slice(0, room).trimEnd()}…${BRAND_SUFFIX}`;
}

export function metaDescription(text: string, max = 155): string {
  const plain = text
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${cut.slice(0, space > 0 ? space : cut.length).replace(/[,.;:]$/, '')}…`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

export interface ProductLdInput {
  name: string;
  description: string;
  url: string;
  images: string[];
  price: number;
  inStock: boolean;
}

export function productJsonLd(p: ProductLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images,
    url: p.url,
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      url: p.url,
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: absoluteUrl('/apple-touch-icon.png'),
    email: site.email.hello,
    sameAs: [site.etsyShopUrl],
  };
}

export function websiteJsonLd() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
