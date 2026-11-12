import type { Catalog } from './catalog';
import { toLocalCents, type Currency } from './currency';
import { freeShippingThresholdCents, shippingFor } from './money';

export interface BagLine { slug: string; option?: string; qty: number }
export interface PricedLine { slug: string; name: string; option?: string; qty: number; unitCents: number; lineCents: number; thumb: string }
export interface PricedBag { currency: Currency; lines: PricedLine[]; subtotalCents: number; shippingCents: number; totalCents: number; freeShippingGapCents: number; dropped: string[] }

const clampQty = (q: number) => Math.min(5, Math.max(1, Math.trunc(Number(q)) || 1));

/** The "from" price of an item in `currency`, for cards and suggestions. */
export function displayCents(item: Catalog[string], currency: Currency): number {
  const fixed = currency === 'EUR' ? undefined : item.localPrices?.[currency];
  if (fixed && Object.keys(fixed).length) return Math.min(...Object.values(fixed));
  const eur = item.optionPriceCents ? Math.min(...Object.values(item.optionPriceCents)) : item.priceCents;
  return toLocalCents(eur, currency);
}

/** All cents in the result are in `currency`. Unit prices convert first, so a line always matches the product page. */
export function priceBag(lines: BagLine[], catalog: Catalog, currency: Currency = 'EUR'): PricedBag {
  const priced: PricedLine[] = [];
  const dropped: string[] = [];
  for (const line of lines) {
    const item = catalog[line.slug];
    if (!item) { dropped.push(line.slug); continue; }
    const optionOk = item.option ? !!line.option && item.option.values.includes(line.option) : !line.option;
    if (!item.inStock || !item.siteCheckout || !optionOk) { dropped.push(item.name); continue; }
    const qty = clampQty(line.qty);
    const eurCents = (line.option ? item.optionPriceCents?.[line.option] : undefined) ?? item.priceCents;
    const fixed = currency === 'EUR' ? undefined : item.localPrices?.[currency]?.[line.option ?? ''];
    const unitCents = fixed ?? toLocalCents(eurCents, currency);
    priced.push({ slug: item.slug, name: item.name, option: item.option ? line.option : undefined, qty, unitCents, lineCents: unitCents * qty, thumb: item.thumb });
  }
  const subtotalCents = priced.reduce((s, l) => s + l.lineCents, 0);
  // The shop's flat rate under the threshold; free with any bundle pack of two or more.
  const packShipsFree = priced.some((l) => !!l.option && !!catalog[l.slug]?.shipsFree?.includes(l.option));
  const shippingCents = packShipsFree ? 0 : shippingFor(subtotalCents, currency);
  const threshold = freeShippingThresholdCents(currency);
  return {
    currency,
    lines: priced,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShippingGapCents: !packShipsFree && subtotalCents > 0 && subtotalCents < threshold ? threshold - subtotalCents : 0,
    dropped,
  };
}
