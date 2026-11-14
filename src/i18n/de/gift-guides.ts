// German gift guides at /de/geschenke/<slug>/, keyed by the English guide's slug
// (src/data/gift-guides.ts). Picks and prices come from the English guide; this holds the words.

export interface GiftGuideDe {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Product slug → why it suits. One for every English pick. */
  why?: Record<string, string>;
  faq: { q: string; a: string }[];
}

export const GIFT_GUIDES_DE: Record<string, GiftGuideDe> = {
  'christmas-gifts': {
    slug: 'weihnachtsgeschenke',
    title: 'Handgemachte Weihnachtsgeschenke: Häkeltaschen, Untersetzer und Mützen',
    description: 'Handgemachte Weihnachtsgeschenke: handgehäkelte Figurentaschen, eine Zopfmuster-Tasche, Untersetzer-Sets und eine Regenbogen-Zauberermütze für Kinder. Auf Bestellung gemacht, also früh bestellen.',
    h1: 'Handgemachte Weihnachtsgeschenke',
    intro: 'Ein Geschenk, das jemand von Hand gemacht hat, für alle, für die man schwer etwas findet. Jedes Stück hier ist von Hui gehäkelt oder gestrickt und wird auf Bestellung gemacht, es lohnt sich also, für Weihnachten früh zu bestellen.',
    why: {
      'frog-phone-crossbody': 'Ein Frosch in Latzhose, dessen großes gelbes Maul ein Handy bis 6,7 Zoll hält. Rosa, blaue oder braune Latzhose, zwei Gurte im Paket und 12 Fünf-Sterne-Bewertungen.',
      'fuzzy-monster-phone-bag': 'Ein zotteliges Monster mit Libellenflügeln. Das Handy kommt durch das offene Maul hinein, ganz ohne Reißverschluss. Für Handys bis 6,5 Zoll. Rosa oder Gelb.',
      'plush-dog-crossbody-phone-bag': 'Für Hundefans: eine weiche Plüsch-Handytasche als grauer Schnauzer, beiger Welpe oder weißer Terrier, mit plastischer 3D-Nase.',
      'cable-knit-tote-bag': 'Eine grob gestrickte Zopfmuster-Tasche für kalte Tage, mit Platz für einen Laptop mit 13 bis 15 Zoll in der Hülle. Creme, Khaki oder Terrakotta.',
      'sheep-crossbody-bag': 'Ein kleines Lamm mit lockigem Noppenkopf und baumelnden Beinen. Für Handys bis 6,7 Zoll, mit Knopfverschluss.',
      'panda-crossbody-bag': 'Ein mürrisch guckender Panda mit roten Wangen, als Mini-Tasche oder hohe Umhängetasche. Für Handy, Karten, Schlüssel und Lippenpflege.',
      'rainbow-crochet-wizard-hat': 'Für Kinder: eine Regenbogenmütze mit Spitze und Stern obendrauf. Die gerüschte Krempe lässt sich über die Ohren ziehen. Größen für 2 bis 5 und 5 bis 9 Jahre.',
      'flower-mandala-coaster': 'Für Gastgeber: Blumen-Mandala-Untersetzer mit rund 14 cm Durchmesser, im 4er-, 6er- oder 8er-Pack mit kostenlosen Mini-Körbchen. Ab sechs ist der Versand kostenlos.',
      'animal-coasters-cat-pig-and-bear': 'Ein Schwein mit Wassermelonenbauch, ein Bär mit Orangenscheibe und eine Katze mit Kiwi, dick und weich, rund 15 cm im Durchmesser.',
    },
    faq: [
      { q: 'Wann sollte ich für Weihnachten bestellen?', a: 'So früh wie möglich. Jedes Stück wird auf Bestellung gemacht und innerhalb von 3–5 Tagen verschickt. Danach dauert die Lieferung in die EU 6 bis 14 Werktage, nach Großbritannien 5 bis 8, in die USA und nach Kanada 6 bis 12 und nach Irland 7 bis 12. Bestell am besten bis zum 1. Dezember.' },
      { q: 'Kann ich es direkt an die Person schicken?', a: 'Ja. Gib an der Kasse ihre Adresse ein, und wir schicken es ihr mit Sendungsverfolgung.' },
      { q: 'Sind zwei günstiger?', a: 'Ja, bei den Stücken mit Set-Seite, zum Beispiel Star Frogs, Big Mouth Monsters und Snout & About. Ab zwei ist der Versand kostenlos, und jedes Stück kostet weniger.' },
      { q: 'Was, wenn es nicht passt?', a: 'Du kannst es innerhalb von 30 Tagen nach Lieferung zurückgeben und bekommst den Preis und die ursprünglichen Versandkosten erstattet.' },
    ],
  },
  'gifts-for-frog-lovers': {
    slug: 'geschenke-fuer-froschfans',
    title: 'Geschenke für Froschfans: handgehäkelte Froschtaschen',
    description: 'Geschenkideen für Froschfans: handgehäkelte Froschtaschen für Handy, Schlüssel und Lippenpflege. Frösche in Latzhose, im Kapuzenpulli oder mit Kleeblatt.',
    h1: 'Geschenke für Froschfans',
    intro: 'Jede Familie hat einen Froschfan. Das hier sind handgehäkelte Frösche, die man wirklich benutzen kann: Jeder ist eine Tasche für Handy, Schlüssel und Lippenpflege, mit einem Gesicht, das auffällt.',
    why: {
      'frog-phone-crossbody': 'Ein Frosch in Latzhose, dessen großes gelbes Maul ein Handy bis 6,7 Zoll hält. Rosa, blaue oder braune Latzhose, zwei Gurte im Paket und 12 Fünf-Sterne-Bewertungen.',
      'finn-the-shamrock-frog-bag': 'Ein 39 cm großer Frosch in Latzhose mit aufgenähtem Kleeblatt. Schön für alle, die fern von Irland leben. Versand innerhalb von 4 Werktagen, 60 Tage Rückgabe.',
      'frog-crossbody-purse': 'Ein Frosch mit spitzer Kapuze und kleiner Weste. Sein großes rotes Maul hält Handy, Schlüssel und Lippenpflege. Gelb oder Blau.',
      'frog-crossbody-phone-bag': 'Sein Maul klappt auf wie ein Scharnier, so fällt das Handy direkt hinein. Gesprenkelter, flauschiger Bauch und ein 110-cm-Gurt.',
      'animal-crossbody-phone-bag': 'Wähle den grasgrünen Frosch mit Wackelaugen und frecher roter Zunge. Eine schmale Tasche, die mit einem Magneten zuklickt.',
    },
    faq: [
      { q: 'Welche Froschtasche passt für das größte Handy?', a: 'Die Star Frogs nehmen Handys bis 6,7 Zoll. Finn & the Shamrock trägt ein großes Handy in einer dicken Hülle.' },
      { q: 'Sind zwei günstiger?', a: 'Ja, bei den Star Frogs, Finn in the Hood und Finn & the Shamrock. Ab zwei ist der Versand kostenlos, und jeder Frosch kostet weniger.' },
      { q: 'Wie schnell kommt er an?', a: 'Jeder Frosch wird auf Bestellung gemacht und innerhalb von 3–5 Tagen mit Sendungsverfolgung verschickt. Finn & the Shamrock geht innerhalb von 4 Werktagen raus.' },
    ],
  },
  'gifts-for-dog-lovers': {
    slug: 'geschenke-fuer-hundefans',
    title: 'Geschenke für Hundefans: handgehäkelte Hundetaschen',
    description: 'Geschenkideen für Hundefans: handgehäkelte Hundetaschen, von der weichen Schnauzer-Handytasche bis zum langen, knautschigen Hund und dem flauschigen Pudel mit eigenem Kamm.',
    h1: 'Geschenke für Hundefans',
    intro: 'Für die Freundin, die auf der Straße jeden Hund streichelt. Jedes dieser Stücke ist ein handgehäkelter Hund, der ein Handy oder die kleinen Dinge trägt, das Geschenk wird also jeden Tag benutzt.',
    why: {
      'plush-dog-crossbody-phone-bag': 'Eine weiche Plüsch-Handytasche als grauer Schnauzer, beiger Welpe oder weißer Terrier, mit flauschiger 3D-Nase. Rund 110 g.',
      'fluffy-dog-crossbody-bag': 'Lockiges Schlingenfell, Schlappohren und eine große schwarze Nase. Für Handys bis 6,5 Zoll. Braun, Beige oder Blau.',
      'poodle-crossbody-bag': 'Ein flauschiger Pudel mit drei winzigen Haarspangen und einem kleinen Kamm, damit das Fell flauschig bleibt. Honiggelb, Cremeweiß oder Karamell.',
      'dog-crossbody-purse': 'Ein langer, knautschiger Hund, 34 cm von der Nase bis zum Schwanz, mit Schlappohren und vier runden Füßen. Khaki oder Gelb.',
      'puppy-face-crossbody-bag': 'Ein Welpengesicht mit ungleichen Augen und Schlappohren. Am kurzen Henkel tragen oder quer über dem Körper am 100-cm-Gurt. Creme oder Hellbraun.',
      'plush-crossbody-bag-puppy-bear-cat': 'Wähle den weißen Welpen mit Partyhut und winziger Erdbeertorte. Eine weiche Plüschtasche, in die ein Handy passt.',
    },
    faq: [
      { q: 'Welche Hundetaschen passen für ein Handy?', a: 'Snout & About und die Party Animals sind für ein Handy gemacht, und Fuzzy Pups passt für Handys bis 6,5 Zoll. Pudel, Stretch Dogs und Puppy Pockets halten auch ein Handy, dazu Schlüssel und Lippenpflege.' },
      { q: 'Sind sie für Erwachsene oder Kinder?', a: 'Für beide. Erwachsene tragen sie als Umhängetasche, Kinder bewahren darin Münzen, kleines Spielzeug und Süßigkeiten auf. Es sind Taschen, kein Spielzeug, also nicht für Kinder unter 3 Jahren.' },
      { q: 'Sind zwei günstiger?', a: 'Ja, bei den Hundetaschen mit Set-Seite: Snout & About, Fuzzy Pups, Puppy Pockets, Stretch Dogs und den Party Animals. Ab zwei ist der Versand kostenlos, und jede kostet weniger.' },
    ],
  },
  'gifts-for-cat-lovers': {
    slug: 'geschenke-fuer-katzenfans',
    title: 'Geschenke für Katzenfans: handgehäkelte Katzentaschen und Untersetzer',
    description: 'Geschenkideen für Katzenmenschen, die schon die Tasse haben: handgehäkelte Katzentaschen im kleinen Pullover, eine Plüschkatze mit Schleife und ein Katzen-Untersetzer mit Kiwibauch.',
    h1: 'Geschenke für Katzenfans',
    intro: 'Die Katzentasse, die Socken und den Stoffbeutel haben sie schon. Diese hier sind anders: von Hand gehäkelte Katzen, als Taschen zum Tragen und als Untersetzer für den Tisch.',
    why: {
      'cat-crossbody-bag-with-dangling-legs': 'Miso ist eine Katze im kleinen Pullover mit einem breiten Maul für Schlüssel und Lippenpflege und langen Beinen, die beim Gehen baumeln. Schwarz, Braun oder Gelb.',
      'plush-crossbody-bag-puppy-bear-cat': 'Wähle die braune Katze mit gepunkteter Schleife. Weicher Plüsch, geräumig genug für Handy, Geldbörse und Puderdose.',
      'animal-crossbody-phone-bag': 'Wähle die knallrosa Katze mit gelben Augen, Schnurrhaaren und langen baumelnden Beinen. Eine schmale Handytasche, die mit einem Magneten zuklickt.',
      'animal-coasters-cat-pig-and-bear': 'Ein cremefarbener Katzen-Untersetzer mit rötlichen Streifen und Kiwibauch, rund 15 cm groß. Gibt es auch als Set mit Schwein und Bär.',
    },
    faq: [
      { q: 'Was passt in die Miso-Katzentasche?', a: 'Schlüssel, Lippenpflege, Taschentücher, Kopfhörer, eine Puderdose oder eine Fahrkarte. Für ein Handy nimmst du die Party-Animals-Katze oder die rosa Katze der Googly Gang.' },
      { q: 'Kann ich nur einen Katzen-Untersetzer kaufen?', a: 'Ja. Die Fruit Bellies gibt es einzeln, zu zweit oder als Dreierset, und ab zwei ist der Versand kostenlos.' },
    ],
  },
  'coaster-sets-housewarming-gifts': {
    slug: 'untersetzer-sets-zur-einweihung',
    title: 'Untersetzer-Sets als Geschenk zur Einweihung: handgehäkelt',
    description: 'Geschenkideen zur Einweihung: handgehäkelte Untersetzer-Sets mit Mandalas, Sonnenblumen, Rosen und Nelken, vom 2er-Set bis zum 8er-Pack. Fertig zum Verschenken und jeden Tag in Gebrauch.',
    h1: 'Untersetzer-Sets als Geschenk zur Einweihung',
    intro: 'Ein neues Zuhause braucht ein paar Dinge für den Tisch. Ein Set handgehäkelter Untersetzer wird ab der ersten Tasse Tee benutzt, und diese kommen fertig zum Verschenken, viele mit eigenem Körbchen oder als Strauß gefaltet.',
    why: {
      'flower-mandala-coaster': 'Blumen-Mandalas mit rund 14 cm Durchmesser, in einer Farbmischung, die Hui aussucht. Packungen mit 4, 6 oder 8, mit Mini-Körbchen gratis. 6er- und 8er-Pack versandkostenfrei.',
      'rose-flower-coaster-with-mini-basket': 'Zwölf winzige Rosen rund um jeden 16-cm-Untersetzer, und jeder faltet sich in sein eigenes kleines Körbchen. Sets mit 2, 4 oder 6 in sechs Farben.',
      'carnation-mug-rug-that-folds-into-a-mini': 'Jeder faltet sich zu einem Nelkenstrauß und öffnet sich zu einem 14,5-cm-Untersetzer. Rosa, Lila oder gemischt, in Sets mit 2, 4 oder 6.',
      'mandala-coaster-set-of-5': 'Fünf große 19-cm-Mandalas, jedes in einer eigenen Farbvariante, so bekommt jeder Gast einen anderen.',
      'sunflower-coasters-set-of-4': 'Vier ganze Sonnenblumen mit Stiel und Blättern, Blüten mit 14 cm, rund 21 cm von Ende zu Ende.',
      'flower-coaster-with-stem-and-leaves': 'Vier 15-cm-Blumen-Untersetzer mit Stiel, je einer in vier kräftigen Farbvarianten.',
      'animal-coasters-cat-pig-and-bear': 'Ein Schwein mit Wassermelonenbauch, ein Bär mit Orangenscheibe und eine Katze mit Kiwi, dick und weich, rund 15 cm groß.',
    },
    faq: [
      { q: 'Welches Untersetzer-Set wird kostenlos versandt?', a: 'Bestellungen ab 50 € werden kostenlos versandt. Außerdem sind Fold-&-Bloom- und Potted-Roses-Sets mit vier oder sechs, Mandala-Blooms-Packs mit sechs oder acht und zwei oder mehr Fruit Bellies immer versandkostenfrei.' },
      { q: 'Passt ein großer Becher darauf?', a: 'Ja. Die Untersetzer haben 14 bis 19 cm Durchmesser, breit genug für einen großen Becher.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser unter 40 °C waschen und flach liegend trocknen. Jede Produktseite hat ihren eigenen Pflegehinweis.' },
    ],
  },
  'mothers-day-gifts': {
    slug: 'muttertagsgeschenke',
    title: 'Muttertagsgeschenke: handgehäkelte Blumen und Taschen',
    description: 'Handgemachte Muttertagsgeschenke: gehäkelte Nelken, die sich zum Strauß falten, Rosen-Untersetzer im Körbchen, Blumentaschen und ein passendes Set in Groß und Klein.',
    h1: 'Muttertagsgeschenke',
    intro: 'Blumen, die länger als eine Woche halten, und Taschen für die Dinge, die sie wirklich dabeihat. Jedes Stück hier ist von Hui von Hand gehäkelt, es kommt also als Geschenk an, das ein Mensch gemacht hat, nicht aus dem Regal.',
    why: {
      'carnation-mug-rug-that-folds-into-a-mini': 'Eine gehäkelte Nelke, die sich zu einem Strauß mit Blattkordel faltet und dann zum Untersetzer für ihren Tee wird. Rosa, Lila oder gemischt, in Sets mit 2, 4 oder 6.',
      'rose-flower-coaster-with-mini-basket': 'Zwölf winzige Rosen rund um einen 16-cm-Untersetzer, der sich in sein eigenes Körbchen faltet und im Regal steht wie ein Rosentopf. Sechs Farben.',
      'fat-lips-girl-crossbody-phone-bag-with-daisy': 'Eine Puppentasche mit großen roten Lippen, Perlen und einem Gänseblümchen, in Groß und Klein. Das Groß-und-klein-Set ist gemacht für den Partnerlook mit der Tochter.',
      'flower-shoulder-bag-with-flower-charm': 'Reihen bauschiger Blütenknospen, in Groß und Klein, so können Mutter und Kind im Partnerlook gehen, ohne dieselbe Tasche zu tragen. Rosa, Blau oder Gelb.',
      '3d-flower-crochet-phone-bag': 'Eine Handytasche mit plastisch geformter 3D-Rose oder Sonnenblume vorne, an einem 110-cm-Gurt. Mit 5,0 aus 2 Bewertungen.',
      'tulip-phone-bag': 'Eine Handytasche voller winziger gehäkelter Tulpen oder Sonnenblumen, mit Kunstperlen-Anhänger und passender Knospe.',
      'camellia-granny-square-bag': 'Ein Granny-Square-Täschchen mit voller 3D-Kamelie vorne und Kordelzug. Rot, Grün, Rosa oder Orange.',
    },
    faq: [
      { q: 'Wann sollte ich für den Muttertag bestellen?', a: 'Jedes Stück wird auf Bestellung gemacht und innerhalb von 3–5 Tagen verschickt, die Lieferzeit danach hängt vom Land ab. Auf der Versandseite steht die Lieferzeit für jedes Land, bestell also mit etwas Vorlauf.' },
      { q: 'Kann ich es direkt an sie schicken?', a: 'Ja. Gib an der Kasse ihre Adresse ein, und wir schicken es ihr mit Sendungsverfolgung.' },
      { q: 'Ist ein Set günstiger?', a: 'Ja. Fold-&-Bloom- und Potted-Roses-Sets mit vier oder sechs werden kostenlos versandt, und das Pearl-&-Daisy-Set in Groß und Klein kostet weniger als die beiden Taschen einzeln und wird kostenlos versandt.' },
    ],
  },
  'handmade-gifts-under-40': {
    slug: 'handgemachte-geschenke-unter-40-euro',
    title: 'Handgemachte Geschenke unter 40 €: Häkeltaschen, Untersetzer und Mützen',
    description: 'Handgemachte Geschenke unter 40 €: jede Häkeltasche, jedes Untersetzer-Set und jede Mütze im Shop unter 40 €, jedes Stück von Hand gemacht von Hui.',
    h1: 'Handgemachte Geschenke unter 40 €',
    intro: 'Ein Geschenk, das jemand von Hand gemacht hat, ohne hohen Preis. Jedes Stück hier kostet einzeln weniger als 40 €, ist von Hui gehäkelt und wird innerhalb von 3–5 Tagen mit Sendungsverfolgung verschickt.',
    faq: [
      { q: 'Ist der Versand inklusive?', a: 'Der Versand kostet 6 € pro Bestellung und ist ab 50 € kostenlos. Kaufst du zwei oder mehr desselben Set-Artikels, zum Beispiel zwei Star Frogs, ist der Versand immer kostenlos.' },
      { q: 'Kann ich es direkt an die Person schicken?', a: 'Ja. Gib an der Kasse ihre Adresse ein. Wir liefern nach Irland, Großbritannien, in die USA, nach Kanada, Norwegen und in 11 EU-Länder.' },
      { q: 'Was, wenn es nicht passt?', a: 'Du kannst es innerhalb von 30 Tagen nach Lieferung zurückgeben und bekommst den Preis und die ursprünglichen Versandkosten erstattet.' },
    ],
  },
};
