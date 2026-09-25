import { describe, expect, it } from 'vitest';
import { centeredTransform, cropViewBox, svgDoc } from '../../scripts/lib/logo.mjs';

describe('cropViewBox', () => {
  it('crops tightly to a bbox with default 2% padding', () => {
    // pad = round(max(100, 50) * 0.02) = 2
    expect(cropViewBox({ left: 10, top: 20, width: 100, height: 50 })).toBe('8 18 104 54');
  });

  it('honours a custom padding percentage', () => {
    // pad = round(max(200, 100) * 0.1) = 20
    expect(cropViewBox({ left: 0, top: 0, width: 200, height: 100 }, 0.1)).toBe('-20 -20 240 140');
  });

  it('supports zero padding', () => {
    expect(cropViewBox({ left: 5, top: 5, width: 40, height: 40 }, 0)).toBe('5 5 40 40');
  });
});

describe('centeredTransform', () => {
  it('centres a wide bbox in a square canvas at the target width', () => {
    // bbox 200x100 -> scale 0.5 for targetWidth 100, targetHeight 50
    // tx = (100-100)/2 - 0*0.5 = 0; ty = (100-50)/2 - 0*0.5 = 25
    const t = centeredTransform({ bbox: { left: 0, top: 0, width: 200, height: 100 }, targetWidth: 100, canvasWidth: 100, canvasHeight: 100 });
    expect(t).toBe('translate(0 25) scale(0.5)');
  });

  it('accounts for a non-zero bbox origin', () => {
    // bbox 40x40 at (10,10) -> scale 2 for targetWidth 80, targetHeight 80
    // tx = (100-80)/2 - 10*2 = -10; ty = (100-80)/2 - 10*2 = -10
    const t = centeredTransform({ bbox: { left: 10, top: 10, width: 40, height: 40 }, targetWidth: 80, canvasWidth: 100, canvasHeight: 100 });
    expect(t).toBe('translate(-10 -10) scale(2)');
  });
});

describe('svgDoc', () => {
  it('wraps content in an accessible svg document', () => {
    const doc = svgDoc({ viewBox: '0 0 100 50', label: 'Sunnie', body: '<g/>' });
    expect(doc).toContain('viewBox="0 0 100 50"');
    expect(doc).toContain('role="img"');
    expect(doc).toContain('aria-label="Sunnie"');
    expect(doc).toContain('<g/>');
  });
});
