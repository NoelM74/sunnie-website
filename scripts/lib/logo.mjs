// Pure helpers for assembling traced logo assets. No file or network I/O here
// so they stay easy to unit test; scripts/build-logo.mjs does the tracing/IO.

function round(n, decimals = 2) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Pads a raster bounding box (as returned by sharp's `.trim()`, in source
 * pixel units) and returns an SVG viewBox string cropped tightly to it.
 *
 * @param {{left: number, top: number, width: number, height: number}} bbox
 * @param {number} padPct - padding on each side, as a fraction of the larger dimension
 */
export function cropViewBox({ left, top, width, height }, padPct = 0.02) {
  const pad = Math.round(Math.max(width, height) * padPct);
  return `${left - pad} ${top - pad} ${width + pad * 2} ${height + pad * 2}`;
}

/**
 * Computes an SVG transform that centres a traced shape's bounding box
 * inside a canvas at a given target width, preserving aspect ratio.
 *
 * @param {{left: number, top: number, width: number, height: number}} bbox - shape bbox, source pixel units
 * @param {number} targetWidth - desired rendered width within the canvas
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {string} an SVG `transform` attribute value
 */
export function centeredTransform({ bbox, targetWidth, canvasWidth, canvasHeight }) {
  const scale = targetWidth / bbox.width;
  const targetHeight = bbox.height * scale;
  const tx = (canvasWidth - targetWidth) / 2 - bbox.left * scale;
  const ty = (canvasHeight - targetHeight) / 2 - bbox.top * scale;
  return `translate(${round(tx)} ${round(ty)}) scale(${round(scale, 4)})`;
}

/** Wraps SVG body markup in an accessible document with the given viewBox. */
export function svgDoc({ viewBox, label, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${body}</svg>\n`;
}
