import type { Catalog } from './catalog';
import { FREE_SHIPPING_THRESHOLD_CENTS, shippingFor } from './money';

export interface BagLine { slug: string; option?: string; qty: number }
export interface PricedLine { slug: string; name: string; option?: string; qty: number; unitCents: number; lineCents: number; thumb: string }
export interface PricedBag { lines: PricedLine[]; subtotalCents: number; shippingCents: number; totalCents: number; freeShippingGapCents: number; dropped: string[] }

const clampQty = (q: number) => Math.min(5, Math.max(1, Math.trunc(Number(q)) || 1));

export function priceBag(lines: BagLine[], catalog: Catalog): PricedBag {
  const priced: PricedLine[] = [];
  const dropped: string[] = [];
  for (const line of lines) {
    const item = catalog[line.slug];
    if (!item) { dropped.push(line.slug); continue; }
    const optionOk = item.option ? !!line.option && item.option.values.includes(line.option) : !line.option;
    if (!item.inStock || !optionOk) { dropped.push(item.name); continue; }
    const qty = clampQty(line.qty);
    priced.push({ slug: item.slug, name: item.name, option: item.option ? line.option : undefined, qty, unitCents: item.priceCents, lineCents: item.priceCents * qty, thumb: item.thumb });
  }
  const subtotalCents = priced.reduce((s, l) => s + l.lineCents, 0);
  const shippingCents = shippingFor(subtotalCents);
  return {
    lines: priced,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShippingGapCents: subtotalCents > 0 && subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS ? FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents : 0,
    dropped,
  };
}
