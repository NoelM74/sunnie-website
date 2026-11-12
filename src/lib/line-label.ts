// How a bag line reads in the basket, checkout, thank-you page and emails.
// A bundle pack ("2 dogs: Grey Schnauzer + Beige Puppy", or Finn's "2 frogs") is one
// line at one price, so it must never read as "1 × bag" or "€69.95 each".

const PACK = /^(\d+) [A-Za-z]+(?::|$)/;

/** Pieces in a bundle pack, or null for an ordinary option. */
export function packSize(option: string | undefined): number | null {
  const m = option ? PACK.exec(option) : null;
  return m ? Number(m[1]) : null;
}

/** "Snout & About dog phone bag, 2 dogs: Grey Schnauzer + Beige Puppy" (with "2 × " only when there are two packs). */
export function lineLabel(l: { qty: number; name: string; option?: string }): string {
  if (packSize(l.option) !== null) return `${l.qty > 1 ? `${l.qty} × ` : ''}${l.name}, ${l.option}`;
  return `${l.qty} × ${l.name}${l.option ? ` (${l.option})` : ''}`;
}

/** Price note under a basket line: "2 for €69.95" for a pack, "€34.95 each" otherwise. */
export function unitLabel(l: { option?: string }, price: string): string {
  const n = packSize(l.option);
  if (n === null) return `${price} each`;
  return n > 1 ? `${n} for ${price}` : price;
}
