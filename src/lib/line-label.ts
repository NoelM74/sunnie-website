// How a bag line reads in the basket, checkout, thank-you page and emails.
// A bundle pack ("2 dogs: Grey Schnauzer + Beige Puppy", or Finn's "2 frogs") is one
// line at one price, so it must never read as "1 × bag" or "€69.95 each".

const PACK = /^(\d+) [A-Za-z]+(?::|$)/;

/** Pieces in a bundle pack, or null for an ordinary option. */
export function packSize(option: string | undefined): number | null {
  const m = option ? PACK.exec(option) : null;
  return m ? Number(m[1]) : null;
}

/** "Snout & About dog phone bag, 2 dogs: Grey Schnauzer + Beige Puppy" (with "2 × " only when there are two packs).
 * `shown` is the same line in the page's language (German pages); the pack check reads the stored option. */
export function lineLabel(l: { qty: number; name: string; option?: string }, shown: { name: string; option?: string } = l): string {
  if (packSize(l.option) !== null) return `${l.qty > 1 ? `${l.qty} × ` : ''}${shown.name}, ${shown.option}`;
  return `${l.qty} × ${shown.name}${shown.option ? ` (${shown.option})` : ''}`;
}

/** Price note under a basket line: "2 for €69.95" for a pack, "€34.95 each" otherwise. German: "2 für 69,95 €". */
export function unitLabel(l: { option?: string }, price: string, lang: 'en' | 'de' = 'en'): string {
  const n = packSize(l.option);
  const de = lang === 'de';
  if (n === null) return de ? `${price} pro Stück` : `${price} each`;
  // Pairs (Fold & Bloom coasters) say so, or "2 for €44.95" would read as two coasters.
  if (/^\d+ pairs?\b/.test(l.option!)) return de ? `${n} ${n === 1 ? 'Paar' : 'Paare'} für ${price}` : `${l.option!.split(':')[0]} for ${price}`;
  return n > 1 ? `${n} ${de ? 'für' : 'for'} ${price}` : price;
}
