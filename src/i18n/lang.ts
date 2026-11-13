/** Site languages. English is the default at /; German pages live under /de/. */
export type Lang = 'en' | 'de';
export const LANG_COOKIE = 'sunnie_lang';
/** The German rating style: "4,9" for "4.9". */
export const decimal = (n: string, lang: Lang) => (lang === 'de' ? n.replace('.', ',') : n);
