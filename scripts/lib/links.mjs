export function extractHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

export function internalTarget(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  const path = href.split('#')[0].split('?')[0];
  if (path.endsWith('/')) return `${path.slice(1)}index.html`;
  return path.slice(1);
}
