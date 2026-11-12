import { site } from '../data/site';
import { FREE_SHIPPING_FROM, SHIPPING_FLAT } from './money';

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

export function firstSentences(text: string, count: number): string {
  const plain = text
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // A sentence ends at . ! or ? followed by a space or the end, so "6.5" stays whole.
  const matches = plain.match(/\S[\s\S]*?[.!?]+(?=\s|$)/g);
  if (!matches || matches.length === 0) return plain;
  return matches
    .slice(0, count)
    .map((s) => s.trim())
    .join(' ')
    .trim();
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
  sku?: string;
  material?: string;
  color?: string;
  category?: string;
  /** Per-option prices (euros), when they differ. Present and with 2+ distinct
   * values, the offer becomes an AggregateOffer with a low/high price range. */
  optionPrices?: number[];
  /** Days to return after delivery (30 shop-wide; 60 for Finn & the Shamrock). */
  returnDays?: number;
}

// Shipping and returns for Google Shopping, taken from site.delivery and the shipping and terms pages.
// Rest of the world isn't listed: its 8–30 day spread and many countries don't fit the format.
const EU_EXCEPT_IE = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const DELIVERY_COUNTRIES: { countries: string[]; days: string }[] = [
  { countries: ['IE'], days: site.delivery[0].days },
  { countries: ['GB'], days: site.delivery[1].days },
  { countries: EU_EXCEPT_IE, days: site.delivery[2].days },
  { countries: ['US', 'CA'], days: site.delivery[3].days },
];
export const SHOPPING_COUNTRIES = DELIVERY_COUNTRIES.flatMap((d) => d.countries);
const range = (r: string) => r.split(/[–-]/).map((n) => Number(n.trim()));

export function shippingDetailsLd(priceEur: number) {
  const [hMin, hMax] = range(site.shipsIn.replace(/\s*days?/, ''));
  const rate = priceEur * 100 >= FREE_SHIPPING_FROM.EUR ? 0 : SHIPPING_FLAT.EUR / 100;
  return DELIVERY_COUNTRIES.map((d) => {
    const [tMin, tMax] = range(d.days);
    return {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: rate.toFixed(2), currency: 'EUR' },
      shippingDestination: d.countries.map((c) => ({ '@type': 'DefinedRegion', addressCountry: c })),
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: hMin, maxValue: hMax, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: tMin, maxValue: tMax, unitCode: 'DAY' },
      },
    };
  });
}

export function returnPolicyLd(days = 30) {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: SHOPPING_COUNTRIES,
    returnPolicyCountry: 'IE',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: days,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    refundType: 'https://schema.org/FullRefund',
    merchantReturnLink: absoluteUrl('/shipping/#returns'),
  };
}

export function productJsonLd(p: ProductLdInput) {
  const distinctPrices = p.optionPrices ? [...new Set(p.optionPrices)] : [];
  const availability = p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut';
  const offers =
    distinctPrices.length > 1
      ? {
          '@type': 'AggregateOffer',
          url: p.url,
          priceCurrency: 'EUR',
          lowPrice: Math.min(...distinctPrices).toFixed(2),
          highPrice: Math.max(...distinctPrices).toFixed(2),
          offerCount: distinctPrices.length,
          availability,
          itemCondition: 'https://schema.org/NewCondition',
          shippingDetails: shippingDetailsLd(Math.min(...distinctPrices)),
          hasMerchantReturnPolicy: returnPolicyLd(p.returnDays),
        }
      : {
          '@type': 'Offer',
          url: p.url,
          priceCurrency: 'EUR',
          price: p.price.toFixed(2),
          availability,
          itemCondition: 'https://schema.org/NewCondition',
          shippingDetails: shippingDetailsLd(p.price),
          hasMerchantReturnPolicy: returnPolicyLd(p.returnDays),
        };
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images,
    url: p.url,
    brand: { '@type': 'Brand', name: site.name },
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.material ? { material: p.material } : {}),
    ...(p.color ? { color: p.color } : {}),
    ...(p.category ? { category: p.category } : {}),
    offers,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function itemListJsonLd(name: string, urls: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: urls.map((url, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(url),
      })),
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
    sameAs: [site.pinterestUrl, site.facebookUrl],
    hasMerchantReturnPolicy: returnPolicyLd(),
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
