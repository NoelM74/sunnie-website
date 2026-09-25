import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { COLORS, sunMark, svgDoc, variantColors } from './lib/logo.mjs';

const FONT_DIR = 'node_modules/@fontsource/fraunces/files';
const load = (file) => {
  const buf = readFileSync(`${FONT_DIR}/${file}`);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const serif = load('fraunces-latin-500-normal.woff');
const italic = load('fraunces-latin-400-italic.woff');

// Wordmark outlines so the SVGs render without the font installed.
const sunnie = serif.getPath('Sunnie', 116, 62, 64);
const designs = italic.getPath('Designs', 118, 92, 26);
const width = Math.ceil(Math.max(sunnie.getBoundingBox().x2, designs.getBoundingBox().x2) + 4);
const height = 100;

function fullLogo(variant) {
  const c = variantColors(variant);
  const body =
    sunMark(c) +
    `<path d="${sunnie.toPathData(2)}" fill="${c.word}"/>` +
    `<path d="${designs.toPathData(2)}" fill="${c.sub}"/>`;
  return svgDoc({ width, height, label: 'Sunnie Designs', body });
}

mkdirSync('src/assets/brand', { recursive: true });
mkdirSync('public', { recursive: true });
for (const v of ['full', 'umber', 'terracotta']) {
  writeFileSync(`src/assets/brand/logo-${v}.svg`, fullLogo(v));
}

const favicon = svgDoc({ width: 100, height: 100, label: 'Sunnie Designs', body: sunMark(variantColors('full')) });
writeFileSync('public/favicon.svg', favicon);

await sharp(Buffer.from(favicon), { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');

const touchSun = await sharp(Buffer.from(favicon), { density: 600 }).resize(132, 132).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: COLORS.linen } })
  .composite([{ input: touchSun, gravity: 'centre' }])
  .png()
  .toFile('public/apple-touch-icon.png');

const logoPng = await sharp(Buffer.from(fullLogo('full')), { density: 600 }).resize({ width: 720 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: COLORS.linen } })
  .composite([{ input: logoPng, gravity: 'centre' }])
  .png()
  .toFile('public/og-default.png');

console.log(`Logo set written (wordmark width ${width}).`);
