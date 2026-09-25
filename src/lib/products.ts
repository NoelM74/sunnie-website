export type Category = 'bags' | 'coasters' | 'hats';
export type Group = 'characters' | 'flowers' | 'totes';

export interface ProductLike {
  id: string;
  data: {
    name: string;
    category: Category;
    group?: Group;
    inStock: boolean;
    featured?: 1 | 2 | 3 | 4;
    isNew?: boolean;
  };
}

export const CATEGORY_LABELS: Record<Category, string> = { bags: 'Bags', coasters: 'Coasters', hats: 'Hats' };
export const GROUP_LABELS: Record<Group, string> = {
  characters: 'Characters and animals',
  flowers: 'Flowers',
  totes: 'Totes and shoulder bags',
};
export const GROUP_ORDER: Group[] = ['characters', 'flowers', 'totes'];
export const HATS_NAV_MIN = 4;

export function sortForGrid<T extends ProductLike>(items: readonly T[]): T[] {
  return [...items].sort(
    (a, b) =>
      Number(b.data.inStock) - Number(a.data.inStock) ||
      Number(b.data.isNew ?? false) - Number(a.data.isNew ?? false) ||
      a.data.name.localeCompare(b.data.name),
  );
}

export function inCategory<T extends ProductLike>(items: readonly T[], category: Category): T[] {
  return sortForGrid(items.filter((p) => p.data.category === category));
}

export function inGroup<T extends ProductLike>(items: readonly T[], group: Group): T[] {
  return sortForGrid(items.filter((p) => p.data.category === 'bags' && p.data.group === group));
}

export function featured<T extends ProductLike>(items: readonly T[]): T[] {
  const f = items.filter((p) => p.data.featured !== undefined).sort((a, b) => a.data.featured! - b.data.featured!);
  const slots = new Set(f.map((p) => p.data.featured));
  if (f.length !== 4 || slots.size !== 4) {
    const found = f.map((p) => `${p.id}:${p.data.featured}`).join(', ') || 'none';
    throw new Error(`Expected exactly 4 featured products in slots 1–4, found ${found}`);
  }
  return f;
}

export function newest<T extends ProductLike>(items: readonly T[]): T | undefined {
  return sortForGrid(items).find((p) => p.data.isNew && p.data.inStock);
}

export function related<T extends ProductLike>(items: readonly T[], current: T, n = 4): T[] {
  const others = items.filter((p) => p.id !== current.id);
  const sameCat = others.filter((p) => p.data.category === current.data.category);
  const sameGroup = sortForGrid(sameCat.filter((p) => p.data.group === current.data.group));
  const restCat = sortForGrid(sameCat.filter((p) => p.data.group !== current.data.group));
  const rest = sortForGrid(others.filter((p) => p.data.category !== current.data.category));
  return [...sameGroup, ...restCat, ...rest].slice(0, n);
}

export function showHatsInNav(items: readonly ProductLike[]): boolean {
  return items.filter((p) => p.data.category === 'hats' && p.data.inStock).length >= HATS_NAV_MIN;
}

const EUR = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
export function formatPrice(eur: number): string {
  return EUR.format(eur);
}
