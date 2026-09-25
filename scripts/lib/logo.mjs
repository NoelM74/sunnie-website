export const COLORS = {
  umber: '#4A3222',
  umberMuted: '#7A6855',
  terracotta: '#B04A24',
  butter: '#F0E2C4',
  linen: '#FBF6EE',
};

export function variantColors(variant) {
  switch (variant) {
    case 'full':
      return { ray: COLORS.terracotta, ring: COLORS.terracotta, center: COLORS.butter, word: COLORS.umber, sub: COLORS.umberMuted };
    case 'umber':
      return { ray: COLORS.umber, ring: COLORS.umber, center: null, word: COLORS.umber, sub: COLORS.umber };
    case 'terracotta':
      return { ray: COLORS.terracotta, ring: COLORS.terracotta, center: null, word: COLORS.terracotta, sub: COLORS.terracotta };
    default:
      throw new Error(`Unknown logo variant: ${variant}`);
  }
}

// Sun drawn in a 100×100 box centred on (50,50). Rays run from r=30 to r=46.
export function rays(color, count = 7) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const angle = ((360 / count) * i).toFixed(2);
    out.push(`<rect x="45.5" y="4" width="9" height="16" rx="4.5" fill="${color}" transform="rotate(${angle} 50 50)"/>`);
  }
  return out.join('');
}

// Ring spans r=17..24. With no centre colour the middle stays transparent (one-colour builds).
export function sunMark({ ray, ring, center }) {
  return `<g>${rays(ray)}<circle cx="50" cy="50" r="20.5" fill="${center ?? 'none'}" stroke="${ring}" stroke-width="7"/></g>`;
}

export function svgDoc({ width, height, label, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}">${body}</svg>\n`;
}
