import type { LanderDe } from './lander-types';
import { G, arriveFaq, kidsFaq, mouthFaq, returnsFaq, washFaq } from './lander-common';

// German copy for the bundle pages at /de/go/<slug>/, keyed by the English lander's slug.
// Same rules as the English copy: plain words, what it is and what it does, no claims the
// English page doesn't make. "du", not "Sie".

export const LANDERS_DE: Record<string, LanderDe> = {
  'finn-the-shamrock': {
    name: 'Finn & the Shamrock Froschtasche',
    title: 'Handgehäkelte Froschtasche mit Kleeblatt | Finn & the Shamrock',
    description: 'Finn ist eine handgehäkelte Frosch-Umhängetasche, die dein Handy freihändig trägt. 39 cm groß, zwei Gurte inklusive, aufgenähtes Kleeblatt, Versand innerhalb von 4 Werktagen, 60 Tage Rückgabe.',
    bar: 'Kostenloser Versand ab 2 Fröschen',
    barRight: 'Versand innerhalb von 4 Werktagen',
    ships: 'Versand innerhalb von 4 Werktagen',
    promises: [
      ['Er sieht aus wie auf den Fotos', 'Wenn Maschen, Farbe oder Größe deines Froschs nicht zu den Fotos auf dieser Seite passen, ersetzen wir ihn oder erstatten dir den vollen Preis. Die Rücksendung zahlen wir.'],
      ['Versand innerhalb von 4 Werktagen', 'Dein Frosch verlässt uns innerhalb von vier Werktagen nach deiner Bestellung, das ganze Jahr über. Schaffen wir das nicht, erstatten wir dir die Versandkosten.'],
    ],
    noun: ['Frosch', 'Frösche', 'einen zweiten Frosch'],
    picks: { Green: 'Grün' },
    hero: {
      h1: 'Ein handgehäkelter Frosch, der',
      h1em: 'dein Handy trägt, freihändig.',
      sub: 'Handy ins Maul, und los. Deine Hände bleiben frei, und dein Handy bleibt griffbereit. Finn ist ein 39 cm großer, handgehäkelter Frosch in Latzhose, mit aufgenähtem Kleeblatt und zwei Gurten im Paket.',
      alt: 'Eine Hand steckt ein Handy in cremefarbener Hülle in das gelbe Maul von Finn, einer grünen gehäkelten Froschtasche in Latzhose',
    },
    story: {
      h: 'Dein Handy ist größer geworden. Deine Hosentaschen nicht.',
      paras: [
        'Zähl mal, wie oft du heute deine Taschen abgeklopft hast, um dein Handy zu finden.',
        'Handys sind gewachsen. Hosentaschen sind gleich geblieben. Eine Handtasche ist zu viel für den Weg zum Laden, und ein Handy in der Hand landet auf dem Cafétisch, dem Autodach oder der Parkbank.',
        'Finn macht eine kleine Sache richtig gut. Er hängt quer über deinem Körper. Sein Maul bleibt offen. Dein Handy steht aufrecht in ihm, und du greifst hinein, ohne hinzuschauen. Deine Hände bleiben frei für die Hundeleine, den Kaffee, den Kinderwagen oder den kleinen Menschen, der an deinem Ärmel zieht.',
      ],
      subH: 'Warum ein Maul und kein Reißverschluss?',
      subParas: [
        'Ein Reißverschluss braucht zwei Hände. Bei einem Verschluss musst du nach unten schauen. Finns Maul ist ein Ring aus gelber Häkelarbeit, der die Öffnung offen hält. So geht dein Handy mit einer Hand rein und mit einer Hand wieder raus.',
        'Rechne auch mit ein paar Fragen an der Bushaltestelle. Ein Frosch in Latzhose mit Kleeblatt auf der Brust fällt auf.',
      ],
    },
    fits: {
      h: 'Dein Handy, immer griffbereit.',
      lede: 'Das gelbe Maul ist die Öffnung. Steck dein Handy von oben hinein, und es steht aufrecht in seinem Körper, wo du es mit einer Hand erreichst. Eine Käuferin trägt ihr Handy und einen 6-Zoll-Kindle in ihm.',
      specs: [
        ['Größe', '39 cm hoch, oben 14 cm breit, unten 15 cm, 1 cm dick. Von Hand gemessen, also 1 bis 2 cm Abweichung möglich.'],
        ['Passt hinein', 'Dein Handy, wie auf den Fotos, dazu Schlüssel und eine Karte'],
        ['Öffnung', 'Offenes Maul, ohne Reißverschluss oder Verschluss'],
        ['Gurte', 'Zwei im Paket: ein grüner gehäkelter Gurt und ein 120 cm langer Gurt, verstellbar und abnehmbar, mit goldfarbenen Karabinern'],
        ['Material', 'Weiches Polyestergarn, Holzknöpfe, Kunstperle'],
        ['Pflege', 'Handwäsche bis 40 °C. Flach liegend trocknen, nicht in der prallen Sonne.'],
      ],
      alt: 'Finn, die Froschtasche, nach vorne gehalten, ein Handy steckt in seinem gelben Maul; zu sehen sind Latzhose, Kleeblatt und lange Beine',
    },
    uses: {
      h: 'Wohin Finn mitkommt',
      items: [
        ['Gassirunden.', 'Handy im Frosch, Leine in der einen Hand, Kaffee in der anderen.'],
        ['Konzerte und Festivals.', 'Er sitzt im Gedränge vorne an dir, wo du ihn siehst.'],
        ['Der Weg zur Schule.', 'Dein Handy vorne an dir, nicht verloren unter dem Autositz.'],
        ['Reisetage.', 'Bordkarte auf dem Handy, Handy im Frosch, Pass in der Hand.'],
        ['St. Patrick’s Day.', 'Das Kleeblatt hat er schon. Den Rest bringst du mit.'],
        ['Ein Geschenk für jemanden fern von Irland.', 'Ein kleines, grünes, handgemachtes Stück Heimat.'],
      ],
    },
    craft: {
      h: 'Vier Stunden, eine Häkelnadel, ein Mensch.',
      paras: [
        'Keine Maschine macht Finn. Ein Mensch arbeitet rund vier Stunden an jedem Frosch, Masche für Masche, mit einer Häkelnadel.',
        'Zuerst entstehen sein Körper und sein gelbes Maul. Dann seine Latzhose, mit cremefarbenem Rand an jeder Naht. Das Kleeblatt ist ein eigenes Teil, auf seine Brust genäht, mit einer Kunstperle in der Mitte. Zwei Holzknöpfe halten seine Träger. Schau genau hin, darauf steht „Handmade with love“.',
        'Weil ein Mensch ihn macht, gleicht kein Frosch genau dem anderen. Maschenspannung und Winkel des Kleeblatts ändern sich ein wenig von einem zum nächsten. Deiner ist ein Frosch für sich.',
      ],
      alt: 'Finn, die Froschtasche, quer über dem Körper getragen an einem grünen gehäkelten Gurt, mit langen baumelnden Armen und Beinen und einem Kleeblatt auf der Latzhose',
    },
    offer: {
      h: 'Wähle deine Frösche',
      lede: 'Wir empfehlen zwei: einen für dich und einen für die Freundin, die fragen wird, woher du deinen hast. Ab zwei Fröschen ist der Versand kostenlos, und jeder Frosch kostet weniger.',
      flag2: 'Einen behalten, einen verschenken',
      notes: { 1: 'Nur einer, für dich.', 2: 'Einer zum Behalten, einer zum Verschenken.', 3: 'Drei Geschenke in einer Bestellung erledigt.' },
    },
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Ja. Die Fotos zeigen ein großes Handy in einer dicken Hülle, das durch sein Maul geht, und eine Käuferin trägt ihr Handy und einen 6-Zoll-Kindle darin. Ein Tablet, ein Laptop oder eine Wasserflasche passen nicht.' },
      { q: 'Ist er eine Tasche oder ein Spielzeug?', a: 'Eine Tasche, gemacht für Jugendliche und Erwachsene, mit zwei Gurten und goldfarbenen Metallkarabinern. Er ist nicht für Kinder unter 3 Jahren: Die Knöpfe und die Kunstperle sind Kleinteile.' },
      { q: 'Welchen Gurt soll ich nehmen?', a: 'Er kommt mit beiden. Der grüne gehäkelte Gurt passt zu seinem Körper. Der 120-cm-Gurt ist verstellbar, so trägst du ihn an der Hüfte oder vorne quer. Hak einen der beiden aus, um ihn in der Hand zu tragen.' },
      { q: 'Lässt sich das Maul schließen?', a: 'Nein. Es hat keinen Reißverschluss, keinen Verschluss und keinen Magneten, du greifst also direkt von oben hinein. Im vollen Zug trägst du ihn am besten vorne.' },
      { q: 'Wie wasche ich ihn?', a: 'Von Hand in kühlem oder warmem Wasser waschen, bis 40 °C. Flach liegend trocknen und nicht lange in die pralle Sonne legen.' },
      { q: 'Wann kommt er an?', a: 'Wir verschicken innerhalb von vier Werktagen und erstatten dir die Versandkosten, wenn wir das nicht schaffen. Die Lieferzeiten für jedes Land stehen auf der <a href="/shipping/">Versandseite</a>. Bei Lieferung in die EU, nach Großbritannien oder in die USA zahlst du nichts extra.' },
      { q: 'Was, wenn er mir nicht gefällt?', a: 'Schick ihn innerhalb von 60 Tagen zurück, getragen oder nicht, und du bekommst den vollen Preis erstattet. Wenn du uns sagst, warum, wird die nächste Serie besser.' },
    ],
  },
};

// Keep the shared helpers in use as more landers are added.
void [G, arriveFaq, kidsFaq, mouthFaq, returnsFaq, washFaq];
