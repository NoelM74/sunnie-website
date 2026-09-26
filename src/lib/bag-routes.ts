import type { Catalog } from './catalog';
import type { BagLine } from './pricing';
import { addLine, removeLine, updateLine } from './bag-actions';

type Notice = 'added' | 'updated' | 'removed' | 'invalid';

export function handleBagPost(action: 'add' | 'update' | 'remove', form: FormData, bag: BagLine[], catalog: Catalog): { lines: BagLine[]; notice: Notice } {
  const qty = Number(form.get('qty') ?? 1);
  if (action === 'add') {
    const slug = String(form.get('slug') ?? '');
    const option = form.get('option');
    const item = catalog[slug];
    if (!item || !item.inStock) return { lines: bag, notice: 'invalid' };
    const opt = typeof option === 'string' && option !== '' ? option : undefined;
    const optionOk = item.option ? !!opt && item.option.values.includes(opt) : !opt;
    if (!optionOk) return { lines: bag, notice: 'invalid' };
    return { lines: addLine(bag, opt ? { slug, option: opt, qty } : { slug, qty }), notice: 'added' };
  }
  const index = Number(form.get('index'));
  if (action === 'update') return { lines: updateLine(bag, index, qty), notice: 'updated' };
  return { lines: removeLine(bag, index), notice: 'removed' };
}
