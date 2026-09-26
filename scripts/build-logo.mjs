import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { Potrace } from 'potrace';
import { centeredTransform, cropViewBox, svgDoc } from './lib/logo.mjs';

const COLORS = { umber: '#4A3222', linen: '#FBF6EE', cream: '#FBF6EE', white: '#FFFFFF' };

/** Rasterises an SVG on a solid background, greyscales and thresholds it to
 * pure black/white so potrace has a clean bilevel bitmap to trace. */
async function toBilevel(svgPath, { width, background, threshold }) {
  return sharp(svgPath, { density: 300 })
    .resize({ width })
    .flatten({ background })
    .greyscale()
    .threshold(threshold)
    .png()
    .toBuffer();
}

/** Traces a bilevel bitmap into a single SVG path (fill-rule evenodd) and
 * returns both the path's `d` data and its tight pixel-space bounding box. */
async function traceToPath(bitmap, { turdSize, optTolerance, blackOnWhite }) {
  const tracer = new Potrace({ turdSize, optTolerance, threshold: 128, blackOnWhite });
  await new Promise((resolve, reject) => tracer.loadImage(bitmap, (err) => (err ? reject(err) : resolve())));
  const pathTag = tracer.getPathTag('');
  const d = pathTag.match(/d="([^"]+)"/)[1];

  const meta = await sharp(bitmap).metadata();
  const probeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}"><path d="${d}" fill="#000" fill-rule="evenodd"/></svg>`;
  const { info } = await sharp(Buffer.from(probeSvg)).trim().png().toBuffer({ resolveWithObject: true });
  const bbox = {
    left: -info.trimOffsetLeft,
    top: -info.trimOffsetTop,
    width: info.width,
    height: info.height,
  };
  return { d, bbox };
}

mkdirSync('src/assets/brand', { recursive: true });
mkdirSync('public', { recursive: true });

// --- 1. Wordmark ("sunnie®") -------------------------------------------
const wordmarkBitmap = await toBilevel('assets-src/brand/sunnie-logo-01.svg', {
  width: 1200,
  background: '#ffffff',
  threshold: 140,
});
const wordmark = await traceToPath(wordmarkBitmap, { turdSize: 25, optTolerance: 0.5, blackOnWhite: true });
const wordmarkViewBox = cropViewBox(wordmark.bbox);
const wordmarkSvg = svgDoc({
  viewBox: wordmarkViewBox,
  label: 'Sunnie',
  body: `<path d="${wordmark.d}" fill="${COLORS.umber}" fill-rule="evenodd"/>`,
});
writeFileSync('src/assets/brand/logo-wordmark.svg', wordmarkSvg);

// --- 2. Smile mark (two arches + smile) ---------------------------------
const smileBitmap = await toBilevel('assets-src/brand/sunnie-logo-03.svg', {
  width: 800,
  background: COLORS.umber,
  threshold: 180,
});
const smile = await traceToPath(smileBitmap, { turdSize: 15, optTolerance: 0.8, blackOnWhite: false });

// --- 3. Favicon: umber rounded square + cream smile mark -----------------
const faviconSize = 100;
const smileTransform = centeredTransform({
  bbox: smile.bbox,
  targetWidth: faviconSize * 0.62,
  canvasWidth: faviconSize,
  canvasHeight: faviconSize,
});
const faviconSvg = svgDoc({
  viewBox: `0 0 ${faviconSize} ${faviconSize}`,
  label: 'Sunnie',
  body:
    `<rect width="${faviconSize}" height="${faviconSize}" rx="22" fill="${COLORS.umber}"/>` +
    `<path d="${smile.d}" fill="${COLORS.cream}" fill-rule="evenodd" transform="${smileTransform}"/>`,
});
writeFileSync('public/favicon.svg', faviconSvg);

// --- 4. Raster favicons from the SVG --------------------------------------
await sharp(Buffer.from(faviconSvg), { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');

await sharp(Buffer.from(faviconSvg), { density: 600 })
  .resize(180, 180)
  .flatten({ background: COLORS.linen })
  .png()
  .toFile('public/apple-touch-icon.png');

// --- 5. Social image: linen background, umber circle, white wordmark -----
const circleDiameter = 500;
const circlePng = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${circleDiameter}" height="${circleDiameter}"><circle cx="${circleDiameter / 2}" cy="${circleDiameter / 2}" r="${circleDiameter / 2}" fill="${COLORS.umber}"/></svg>`))
  .png()
  .toBuffer();

const wordmarkTargetWidth = circleDiameter * 0.75;
const wordmarkTransform = centeredTransform({
  bbox: wordmark.bbox,
  targetWidth: wordmarkTargetWidth,
  canvasWidth: circleDiameter,
  canvasHeight: circleDiameter,
});
const whiteWordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${circleDiameter}" height="${circleDiameter}"><path d="${wordmark.d}" fill="${COLORS.white}" fill-rule="evenodd" transform="${wordmarkTransform}"/></svg>`;
const whiteWordmarkPng = await sharp(Buffer.from(whiteWordmarkSvg)).png().toBuffer();

const circleWithWordmark = await sharp(circlePng).composite([{ input: whiteWordmarkPng }]).png().toBuffer();

await sharp({ create: { width: 1200, height: 630, channels: 4, background: COLORS.linen } })
  .composite([{ input: circleWithWordmark, gravity: 'centre' }])
  .png()
  .toFile('public/og-default.png');

console.log(`Logo set written (wordmark viewBox ${wordmarkViewBox}).`);
