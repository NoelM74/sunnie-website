import { describe, expect, it } from 'vitest';
import { page } from './helpers';

describe('home page', () => {
  it('is built with lang="en"', () => {
    expect(page('/')).toMatch(/<html lang="en"/);
  });
});
