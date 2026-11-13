/** Site languages. English is the default at /; German pages live under /de/. */
export type Lang = 'en' | 'de';
export const LANG_COOKIE = 'sunnie_lang';
/** The German rating style: "4,9" for "4.9". */
export const decimal = (n: string, lang: Lang) => (lang === 'de' ? n.replace('.', ',') : n);

/** The language the bag and checkout speak: the last page you shopped on sets the cookie. */
export const langFrom = (cookie: string | undefined): Lang => (cookie === 'de' ? 'de' : 'en');
