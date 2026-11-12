import type { ImageMetadata } from 'astro';

// Lander copy names photos by path under src/assets/ (see src/data/landers.ts).
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/{landers,products}/**/*.{webp,jpg,jpeg,png}', { eager: true });

export function landerImage(src: string): ImageMetadata {
  const hit = all[`../assets/${src}`];
  if (!hit) throw new Error(`Lander photo not found: src/assets/${src}`);
  return hit.default;
}
