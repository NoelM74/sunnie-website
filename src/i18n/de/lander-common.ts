// Shared German FAQ answers, the same promises as the English ones in src/data/landers.ts.
// German pronouns follow the noun's gender: G.m (der Frosch: er/ihn), G.f (die Tasche: sie/sie),
// G.n (das Set: es/es), G.pl (die Untersetzer: sie/sie).
export interface Gender { nom: string; acc: string }
export const G = {
  m: { nom: 'er', acc: 'ihn' },
  f: { nom: 'sie', acc: 'sie' },
  n: { nom: 'es', acc: 'es' },
  pl: { nom: 'sie', acc: 'sie' },
} satisfies Record<string, Gender>;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const washFaq = (g: Gender) => ({
  q: `Wie wasche ich ${g.acc}?`,
  a: `Von Hand in kühlem oder lauwarmem Wasser waschen, höchstens 40 °C. Flach liegend trocknen und nicht lange in die pralle Sonne legen.`,
});
/** `thing`: what Hui makes, with its article, e.g. "deinen Frosch", "deine Tasche". */
export const arriveFaq = (thing: string) => ({
  q: 'Wann kommt meine Bestellung an?',
  a: `Hui fertigt ${thing} auf Bestellung an, und die Bestellung geht innerhalb von 3–5 Tagen mit Sendungsverfolgung raus. Die Lieferzeiten für jedes Land stehen auf der <a href="/shipping/">Versandseite</a>. Bei Lieferung in die EU, nach Großbritannien oder in die USA zahlst du nichts extra.`,
});
export const returnsFaq = (g: Gender) => ({
  q: `Was, wenn ${g.nom} mir nicht gefällt?`,
  a: `Schick ${g.acc} innerhalb von 30 Tagen nach Lieferung zurück, und wir erstatten den Preis, Versand inklusive. Schreib uns einfach vorher eine E-Mail. <a href="/shipping/#returns">So funktioniert die Rückgabe</a>.`,
});
/** `the`: the bag with its article in the accusative, e.g. "den Frosch", "die Tasche". */
export const kidsFaq = (g: Gender, the: string) => ({
  q: `Ist ${g.nom} für Erwachsene oder Kinder?`,
  a: `Für beide. Erwachsene tragen ${the} als lustige Umhängetasche, Kinder bewahren darin Münzen, kleines Spielzeug und Süßigkeiten auf. ${cap(g.nom)} ist eine Tasche, kein Spielzeug, also nicht für Kinder unter 3 Jahren.`,
});
export const mouthFaq = {
  q: 'Lässt sich das Maul schließen?',
  a: 'Nein. Es gibt keinen Reißverschluss, keinen Verschluss und keinen Magneten, du greifst also direkt hinein. Im vollen Zug trägst du die Tasche am besten vorne.',
};
