import { describe, expect, it } from 'vitest';
import { addLine, removeLine, updateLine } from '../../src/lib/bag-actions';

describe('bag actions', () => {
  it('adds and merges the same slug and option', () => {
    const a = addLine([], { slug: 'frog', option: 'Pink', qty: 1 });
    const b = addLine(a, { slug: 'frog', option: 'Pink', qty: 2 });
    expect(b).toEqual([{ slug: 'frog', option: 'Pink', qty: 3 }]);
    expect(addLine(b, { slug: 'frog', option: 'Blue', qty: 1 })).toHaveLength(2);
  });
  it('caps quantity at 5 and lines at 20', () => {
    expect(addLine([{ slug: 'a', qty: 4 }], { slug: 'a', qty: 4 })[0].qty).toBe(5);
    const twenty = Array.from({ length: 20 }, (_, i) => ({ slug: `p${i}`, qty: 1 }));
    expect(addLine(twenty, { slug: 'new', qty: 1 })).toEqual(twenty);
  });
  it('updates and removes by index, ignoring bad indexes', () => {
    const lines = [{ slug: 'a', qty: 1 }, { slug: 'b', qty: 1 }];
    expect(updateLine(lines, 1, 3)[1].qty).toBe(3);
    expect(updateLine(lines, 9, 3)).toEqual(lines);
    expect(removeLine(lines, 0)).toEqual([{ slug: 'b', qty: 1 }]);
    expect(removeLine(lines, -1)).toEqual(lines);
  });
});
