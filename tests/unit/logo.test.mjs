import { describe, expect, it } from 'vitest';
import { COLORS, rays, sunMark, svgDoc, variantColors } from '../../scripts/lib/logo.mjs';

const hexes = (s) => new Set((s.match(/#[0-9A-F]{6}/gi) ?? []).map((h) => h.toUpperCase()));

describe('logo builders', () => {
  it('draws seven rays', () => {
    expect(rays('#000000').match(/<rect/g)).toHaveLength(7);
  });

  it('full colour sun uses terracotta rays and a butter centre', () => {
    const s = sunMark(variantColors('full'));
    expect(hexes(s)).toEqual(new Set([COLORS.terracotta, COLORS.butter]));
  });

  it('umber variant is strictly one colour', () => {
    expect(hexes(sunMark(variantColors('umber')))).toEqual(new Set([COLORS.umber]));
  });

  it('terracotta variant is strictly one colour', () => {
    expect(hexes(sunMark(variantColors('terracotta')))).toEqual(new Set([COLORS.terracotta]));
  });

  it('wraps content in an accessible svg document', () => {
    const doc = svgDoc({ width: 100, height: 50, label: 'Sunnie Designs', body: '<g/>' });
    expect(doc).toContain('viewBox="0 0 100 50"');
    expect(doc).toContain('role="img"');
    expect(doc).toContain('aria-label="Sunnie Designs"');
  });
});
