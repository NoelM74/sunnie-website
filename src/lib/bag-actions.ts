import type { BagLine } from './pricing';

const MAX_QTY = 5;
const MAX_LINES = 20;
const clamp = (q: number) => Math.min(MAX_QTY, Math.max(1, Math.trunc(q) || 1));

export function addLine(lines: BagLine[], add: BagLine): BagLine[] {
  const i = lines.findIndex((l) => l.slug === add.slug && (l.option ?? '') === (add.option ?? ''));
  if (i >= 0) return lines.map((l, k) => (k === i ? { ...l, qty: clamp(l.qty + add.qty) } : l));
  if (lines.length >= MAX_LINES) return lines;
  return [...lines, { ...add, qty: clamp(add.qty) }];
}

export function updateLine(lines: BagLine[], index: number, qty: number): BagLine[] {
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) return lines;
  return lines.map((l, k) => (k === index ? { ...l, qty: clamp(qty) } : l));
}

export function removeLine(lines: BagLine[], index: number): BagLine[] {
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) return lines;
  return lines.filter((_, k) => k !== index);
}
