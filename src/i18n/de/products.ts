// German copy for the product pages at /de/produkte/<slug>/, keyed by the product's slug.
// Photos, prices, options and stock come from the English product file (src/content/products/);
// this holds only the words. Same rules as the English copy: plain words, no new claims.

export interface ProductDe {
  name: string;
  seoTitle: string;
  /** The product description, as HTML. */
  body: string;
  faq: { q: string; a: string }[];
  /** German label for the option group and each option value. Values stay English in the bag. */
  option?: { name: string; values: Record<string, string> };
  materials: string[];
  size?: string;
  /** German alt text for the first photos; later photos get "<name>, Foto N von M". */
  alts: string[];
}

export const PRODUCTS_DE: Record<string, ProductDe> = {
  'sunflower-drawstring-backpack': {
    name: 'Sonnenblumen-Rucksack mit Kordelzug',
    seoTitle: 'Gehäkelter Sonnenblumen-Rucksack mit Kordelzug, grüner handgemachter Beutel mit Blumen',
    body: `<p>Ein gehäkelter Rucksack in Form eines kleinen Blumentopfs, oben mit einem Kranz aus gelben Sonnenblumen und geräumig genug für den echten Alltag.</p>
<p>Hui häkelt den Beutel aus weichem grünem Garn und setzt oben einen Kranz aus gehäkelten Sonnenblumen auf, mit braunen Blütenkörben und Blattranken. Das eine Fach schließt du mit einem Kordelzug, der in einem kleinen gehäkelten Blattanhänger endet.</p>
<ul>
<li><strong>Zwei Träger an gelben Metall-D-Ringen:</strong> trag beide als Rucksack, oder nimm sie zusammen über eine Schulter.</li>
<li><strong>Ein geräumiges Fach:</strong> für Bücher, ein Tablet, ein Handy und einen Regenschirm.</li>
<li><strong>Kordelzug mit Blattanhänger:</strong> zieht die Öffnung zu und dient gleich als Griff.</li>
<li><strong>Zwei Grüntöne, rund 340 g:</strong> normales Grün oder Dunkelgrün, leicht genug für jeden Tag.</li>
</ul>
<p>Eine schöne Wahl für alle, die Sonnenblumen und handgemachte Accessoires lieben, und groß genug, um eine echte Alltagstasche zu sein, nicht nur eine hübsche.</p>
<p><em>B 20 cm, H 23 cm, T 20 cm. Von Hand gehäkelt, daher weichen die Zahl der Sonnenblumen und die Maße leicht ab, rechne mit 1 bis 3 cm in jede Richtung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Bücher, ein Tablet, ein Handy und ein Regenschirm, in einem offenen Fach.' },
      { q: 'Kann ich ihn als Rucksack tragen?', a: 'Ja. Trag beide Träger als Rucksack, oder nimm sie zusammen über eine Schulter.' },
      { q: 'Wie wasche ich ihn?', a: 'Von Hand in kühlem oder warmem Wasser unter 40 °C waschen, feucht in Form ziehen und flach liegend trocknen, nicht lange in der direkten Sonne.' },
    ],
    option: { name: 'Farbe', values: { 'Regular Green': 'Grün', 'Dark Green': 'Dunkelgrün' } },
    materials: ['Garn aus Polyester und Acryl', 'Metall'],
    size: 'B 20 × H 23 × T 20 cm',
    alts: [
      'Grüner gehäkelter Beutelrucksack mit gelben Sonnenblumen obendrauf, auf dem Rücken getragen',
      'Dunkelgrüner gehäkelter Rucksack mit Kordelzug, gelben Sonnenblumen und zwei grünen Blattanhängern',
      'Nahaufnahme der gehäkelten Sonnenblumen oben auf einem grünen Beutelrucksack',
      'Grüner Sonnenblumen-Häkelrucksack über der Schulter getragen, von hinten',
    ],
  },
  'mandala-coaster-set-of-5': {
    name: 'Große Mandala-Untersetzer, 5er-Set',
    seoTitle: 'Gehäkelte Mandala-Untersetzer im 5er-Set, handgemachte Untersetzer mit Wellenrand, 19 cm',
    body: `<p>Ränder von Tassen gehen nicht mehr aus einem Holztisch heraus. Mit diesem Fünferset bekommt jeder am Tisch seinen eigenen Untersetzer, keiner wie der andere.</p>
<p>Hui häkelt jeden Untersetzer von der Mitte nach außen in Farbringen, mit Noppen und Fächermustern, und schließt den Rand mit einer gewellten Blütenkante ab.</p>
<ul>
<li><strong>Fünf Farbvarianten in einem Set:</strong> Grün mit petrolfarbenem Rand, Gelb mit gelbem Wellenrand, Blau und Gelb mit marineblauem Rand, Weiß und Petrol mit marineblauem Rand und Orange mit orangefarbenem Rand, jeder mit seinem eigenen Ringmuster.</li>
<li><strong>19 cm Durchmesser:</strong> größer als ein normaler Untersetzer, mit Platz für eine Tasse und daneben einen Löffel oder einen kleinen Keks.</li>
<li><strong>Rund 20 g pro Stück:</strong> weich, flach und biegsam, und sie lassen sich ordentlich stapeln.</li>
<li><strong>Keine Rückseite nötig:</strong> durchgehend aus gehäkeltem Acrylgarn, vorne und hinten.</li>
</ul>
<p>Eine einfache Art, jedem Gast seine eigene Farbe zu geben, und ein fertiges Geschenk zum Geburtstag, zur Einweihung oder als Dankeschön, denn es lässt sich leicht und flach verschicken.</p>
<p><em>Rund 19 cm Durchmesser. Von Hand gehäkelt, rechne also mit 1 bis 2 cm Unterschied zwischen den Untersetzern.</em></p>`,
    faq: [
      { q: 'Bekomme ich alle fünf Farben?', a: 'Ja, ein Set enthält alle fünf gezeigten Farbvarianten.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder warmem Wasser unter 40 °C waschen, flach liegend trocknen und nicht auswringen oder verdrehen.' },
      { q: 'Passt ein großer Becher darauf?', a: 'Ja. Mit 19 cm Durchmesser ist Platz für einen großen Becher und daneben einen Löffel oder einen kleinen Keks.' },
    ],
    materials: ['Acryl'],
    size: 'Ø 19 cm',
    alts: [
      'Fünf runde gehäkelte Mandala-Untersetzer in Blau, Gelb, Rosa und Petrol, aufgefächert',
      'Gelb-weißer gehäkelter Mandala-Untersetzer mit gewellter Blütenkante',
      'Grün-rosa-cremefarbener gehäkelter Mandala-Untersetzer mit Wellenrand',
    ],
  },
  'sunflower-coasters-set-of-4': {
    name: 'Sonnenblumen-Untersetzer mit Stiel, 4er-Set',
    seoTitle: 'Gehäkelte Sonnenblumen-Untersetzer im 4er-Set, handgemachte Blumen-Untersetzer mit Stiel',
    body: `<p>Vier kleine Sonnenblumen für unter deine Tassen, jede in voller Blumenform mit eigenem Stiel und Blättern statt eines schlichten Kreises.</p>
<p>Hui häkelt zuerst eine braune Spirale als Mitte, legt dann einen Kranz aus bauschigen gelben und orangefarbenen Blütenblättern mit Wellenrand darum und gibt jeder einen kurzen grünen Stiel mit zwei Blättern. Flach genug, um richtig unter einer Tasse zu liegen, und auch ohne Tasse sehen sie aus wie eine kleine Blume.</p>
<ul>
<li><strong>Ganze Sonnenblumenform:</strong> braune Spiralmitte, Wellenrand, Stiel und Blätter, nicht nur ein einfacher Kreis.</li>
<li><strong>4er-Set:</strong> genug für einen ganzen Tisch.</li>
<li><strong>Blüte 14 cm, Stiel 7 cm:</strong> rund 21 cm von Ende zu Ende.</li>
<li><strong>Rund 0,5 cm dick:</strong> liegt flach und stabil unter einer Tasse oder einem Glas.</li>
<li><strong>20 g pro Stück:</strong> das ganze Set wiegt rund 80 g.</li>
</ul>
<p>Ein fröhliches Geschenk zur Einweihung oder zum Geburtstag für alle, die Sonnenblumen oder eine Cottagecore-Küche mögen, und ein Set, das auch aufgefächert auf dem Tisch gut aussieht, wenn es gerade nicht benutzt wird.</p>
<p><em>Blüte Ø 14 cm, Stiel 7 cm, rund 21 cm von Ende zu Ende, 0,5 cm dick. Von Hand gehäkelt, rechne also mit 1 bis 2 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Wie viele Untersetzer sind im Set?', a: 'Vier, jeder mit eigenem Stiel und Blättern.' },
      { q: 'Kann ich sie unter einer Tasse oder einem Glas benutzen?', a: 'Ja. Sie sind rund 0,5 cm dick und liegen flach.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder warmem Wasser unter 40 °C waschen, flach liegend trocknen, nicht auswringen und nicht lange in die direkte Sonne legen.' },
    ],
    materials: ['Acryl'],
    size: 'Ø 14 cm, Stiel 7 cm',
    alts: [
      'Drei gelbe gehäkelte Sonnenblumen-Untersetzer mit grünen Stielen und Blättern, aufgefächert',
      'Gelber gehäkelter Sonnenblumen-Untersetzer mit brauner Mitte und grünem Stiel, flach ausgelegt',
      'Ein bernsteinfarbenes Glas auf einem gelben gehäkelten Sonnenblumen-Untersetzer',
    ],
  },
  'rainbow-tote-bag': {
    name: 'Regenbogen-Netztasche mit Herz-Geldbörse',
    seoTitle: 'Gehäkelte Regenbogen-Tasche, offene Netz-Schultertasche mit Herz-Geldbörse',
    body: `<p>Eine geräumige Netztasche mit eigener abnehmbarer Herz-Geldbörse, so weißt du immer genau, wo deine Karten und deine Lippenpflege sind.</p>
<p>Hui häkelt den Korpus in Farbblockstreifen mit doppelten Henkeln, die gelb abgeschlossen sind. Eine herzförmige Geldbörse hängt an einem Metallring und lässt sich wieder abnehmen, und ein Puffblumen-Anhänger kommt auch mit, seine Farbe ist eine Überraschung.</p>
<ul>
<li><strong>Herz-Geldbörse gratis dabei:</strong> mit weißem Rüschenrand, für Karten, Lippenpflege, Münzen und Kopfhörer, lässt sich überall an der Tasche einhaken.</li>
<li><strong>Puffblumen-Anhänger dabei:</strong> Farbe nach Zufall.</li>
<li><strong>Offener Netzkorpus:</strong> geräumig genug für ein gebundenes Buch, ein iPad, einen Regenschirm, ein Handy und eine Geldbörse auf einmal.</li>
<li><strong>Zwei Farbvarianten:</strong> warm (Zartrosa, Gelb, Rosa, Blau) oder kühl (Weiß, Gelb, Lila, Lavendel, Petrol).</li>
<li><strong>Rund 200 g:</strong> leicht für das, was hineinpasst.</li>
</ul>
<p>Eine Alltagstasche für alle, die etwas wollen, das beim Anschauen Freude macht, und ein Geschenk für alle, die Handgemachtes schätzen.</p>
<p><em>B 31 cm, H 27 cm, T 6 cm, Henkel 48 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was ist bei der Tasche dabei?', a: 'Eine abnehmbare Herz-Geldbörse, 8 x 11 cm, und ein Puffblumen-Anhänger, Farbe nach Zufall.' },
      { q: 'Was passt hinein?', a: 'Ein gebundenes Buch, ein iPad, ein zusammengeklappter Regenschirm, ein Handy und eine Geldbörse.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser waschen, höchstens 40 °C, flach liegend trocknen und nicht lange in die direkte Sonne legen.' },
    ],
    option: { name: 'Farbe', values: { 'warm rainbow': 'Warmer Regenbogen', 'cool rainbow': 'Kühler Regenbogen' } },
    materials: ['Polyester'],
    size: 'B 31 × H 27 × T 6 cm, Henkel 48 cm',
    alts: [
      'Offene gehäkelte Netztasche in warmen Regenbogenstreifen mit Herz-Geldbörse als Anhänger',
      'Offene gehäkelte Netztasche in Rosa- und Gelbtönen mit Herz-Geldbörse',
      'Offene gehäkelte Netztasche in Pastell-Regenbogenstreifen, an den Henkeln hängend',
    ],
  },
  'cable-knit-tote-bag': {
    name: 'Laptoptasche mit Zopfmuster',
    seoTitle: 'Strick-Tasche mit Zopfmuster, Aran-Schultertasche, 3 Farben',
    body: `<p>Eine kräftige Strick-Tasche mit Zopfmuster und echter Form, geräumig genug für einen Laptop und alles andere, was dein Tag braucht.</p>
<p>Hui strickt das erhabene Aran-Zopfmuster in einem durchgehenden Stück durch den Korpus bis in die Henkel, so laufen die Zöpfe ohne Unterbrechung vom Henkel bis zum Boden. Die Öffnung oben hat keinen Reißverschluss, und der 5 cm breite Boden behält seine Form, wenn du die Tasche füllst.</p>
<ul>
<li><strong>Passt für einen 13- bis 15-Zoll-Laptop in einer Hülle,</strong> dazu eine 750-ml-Trinkflasche, ein Buch, eine Geldbörse, Schlüssel, Handy und Sonnenbrille.</li>
<li><strong>Eingestrickte Zopf-Henkel:</strong> als Teil der Tasche gestrickt, nicht extra angenäht.</li>
<li><strong>27 cm Henkelhöhe:</strong> sitzt bequem auf einer Schulter.</li>
<li><strong>Rund 260 g:</strong> solide, ohne leer schwer zu wirken.</li>
<li><strong>Drei Farben:</strong> Creme, Khaki oder Terrakotta.</li>
</ul>
<p>Eine praktische Alltagstasche für den Weg zur Arbeit bei kaltem Wetter, den Markt oder die Bibliothek, und ein gutes Geschenk für alle, die viel tragen und dabei gut aussehen wollen.</p>
<p><em>Oben B 34 cm, unten B 37 cm, H 35 cm, T 5 cm, Henkelhöhe 27 cm. Jede Tasche ist von Hand gestrickt, kleine Unterschiede in Spannung und Struktur sind also möglich.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein 13- bis 15-Zoll-Laptop in einer Hülle, eine 750-ml-Trinkflasche, ein Buch, eine Geldbörse, Schlüssel, ein Handy und eine Sonnenbrille.' },
      { q: 'Lässt sie sich schließen?', a: 'Nein, sie ist oben offen. Steck eine kleine Tasche hinein, wenn du Dinge sicher verstauen willst.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser unter 40 °C waschen oder im Schonwaschgang der Maschine. Flach liegend trocknen, nicht in den Trockner.' },
    ],
    option: { name: 'Farbe', values: { Cream: 'Creme', Khaki: 'Khaki', Terracotta: 'Terrakotta' } },
    materials: ['Zopfstrick', 'Acryl'],
    size: 'B 37 × H 35 × T 5 cm, Henkel 27 cm',
    alts: [
      'Beige Strick-Tasche mit Zopfmuster, hängend, mit Aran-Zöpfen',
      'Cremefarbene Strick-Tasche mit Zopfmuster an einer weißen Schranktür hängend',
      'Terrakottafarbene Strick-Tasche mit Zopfmuster an einer weißen Schranktür hängend',
    ],
  },
  'monster-phone-bag': {
    name: 'Lächelnde blaue Monster-Handytasche',
    seoTitle: 'Gehäkelte Monster-Handytasche aus Chenille, zum Umhängen, mit Perlenknopf',
    body: `<p>Ein lächelndes blaues Monster, so leicht, dass du vergisst, dass du es trägst, mit gerade genug Platz für dein Handy und etwas Bargeld.</p>
<p>Hui häkelt den Körper aus weichem Chenille, gibt ihm weiße gehäkelte Augen mit schwarzen Sicherheitsaugen als Pupillen und ein Lächeln aus weißem Garn, setzt dreidimensionale Arme und Beine mit braunen Bommel-Händen und -Füßen an und schließt die Tasche oben mit einem einzelnen weißen Perlenknopf.</p>
<ul>
<li><strong>Für Handys bis 6,7 Zoll:</strong> dazu flache Karten oder gefaltete Scheine.</li>
<li><strong>Perlenknopf als Verschluss:</strong> schnell zu öffnen und sicher genug, um zu bleiben.</li>
<li><strong>80 cm geflochtener Gurt:</strong> abwechselnd gelbes und braunes Chenille, am Ansatz verstärkt.</li>
<li><strong>Rund 70 g:</strong> eine der leichtesten Taschen im Sortiment.</li>
<li><strong>Bommel-Hände und -Füße:</strong> ganz dreidimensional und von Hand angesetzt.</li>
</ul>
<p>Sie passt zu Band-Shirts, Festival-Looks und lockeren Besorgungstagen, an denen die Figur für sich selbst spricht.</p>
<p><strong>Tipp von Käufern:</strong> Der Perlenknopf geht schnell auf, so kommst du an einem vollen Tag leicht an Bargeld und Karten.</p>
<p><em>B 12 cm, H 17,5 cm, T 1,5 cm, Gurt 80 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Handys bis 6,7 Zoll passen, mit Platz für flache Karten oder gefaltete Scheine.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kaltem Wasser, 15 bis 20 °C, mit mildem Waschmittel waschen, das Wasser ausdrücken, ohne zu wringen, und flach liegend trocknen, fern von Sonne und Hitze.' },
      { q: 'Kann ich sie in der Maschine waschen?', a: 'Nein. Nur Handwäsche, und bitte keinen Trockner und kein Bleichmittel.' },
    ],
    materials: ['Chenille', 'Kunstperlen'],
    size: 'B 12 × H 17,5 × T 1,5 cm, Gurt 80 cm',
    alts: [
      'Blaue gehäkelte Monster-Handytasche mit weißen Augen, Perlenknopf und baumelnden Armen',
      'Blaue gehäkelte Monster-Handytasche an ihrem gelb-braun geflochtenen Gurt hängend',
      'Blaue gehäkelte Monster-Handytasche mit lächelndem Gesicht, von vorne',
    ],
  },
  'blue-monster-crossbody-phone-bag-with-lollipop-belly': {
    name: 'Monster-Handytasche mit Lollibauch',
    seoTitle: 'Blaue gehäkelte Monster-Handytasche zum Umhängen, mit Lolli-Bauch',
    body: `<p>Ein handgehäkeltes blaues Monster mit einem Lolli als Bauchnabel, breit genug für dein Handy und seltsam genug, dass Leute danach fragen.</p>
<p>Hui häkelt den Körper aus einfarbig blauem Garn, formt ein korallenrotes Maul, Wackelaugen aus weißen und schwarzen Perlen und lila Ohren und setzt zum Schluss eine weiß-rosa Spirale in Lolliform auf den Bauch. Das Maul klappt oben auf, also gibt es keinen Reißverschluss und keinen Druckknopf, mit dem du kämpfen musst.</p>
<ul>
<li><strong>Für Handy, Schlüssel, Lippenpflege, Karten, Taschentücher und Münzen:</strong> alles in einem offenen Fach.</li>
<li><strong>112 cm Gurt:</strong> quer über dem Körper oder über der Schulter.</li>
<li><strong>Offenes Maul oben:</strong> kein Reißverschluss, kein Druckknopf, einfach aufklappen und hineingreifen.</li>
<li><strong>Rund 90 g:</strong> so leicht, dass du sie vergisst.</li>
<li><strong>Lolli-Bauch:</strong> eine weiß-rosa Spirale, vorne aufgehäkelt.</li>
</ul>
<p>Ein lustiges Geschenk für Kinder, die seltsame kleine Wesen mögen, und genauso passend für Erwachsene, die eine Handytasche mit Persönlichkeit wollen.</p>
<p><em>Oben B 20 cm, unten B 12 cm, H 26 cm, T 1 cm, Gurt 112 cm. Jedes Monster ist von Hand gehäkelt, daher weichen Maulform, Augenposition und Ohrgröße von Tasche zu Tasche leicht ab.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Schlüssel, Lippenpflege, Karten, Taschentücher und Münzen, alles in einem offenen Fach.' },
      { q: 'Wie wird sie geschlossen?', a: 'Gar nicht. Das Maul ist eine offene Klappe, du greifst direkt hinein.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser bei höchstens 40 °C waschen, flach liegend trocknen und nicht lange in die Sonne legen.' },
    ],
    materials: ['Polyester'],
    size: 'B 12 × H 26 × T 1 cm, Gurt 112 cm',
    alts: [
      'Blaue gehäkelte Monstertasche mit korallenrotem Maul und Lollibauch, quer über dem Körper getragen',
      'Blaue gehäkelte Monstertasche in Nahaufnahme mit Wackelaugen und Lolli',
      'Blaue gehäkelte Monstertasche quer über dem Körper getragen, von hinten, ganze Länge',
    ],
  },
  'poodle-crossbody-bag': {
    name: 'Flauschige Pudeltasche mit Kamm',
    seoTitle: 'Flauschige gehäkelte Pudel-Umhängetasche mit Kamm, 3 Farben',
    body: `<p>Ein flauschiger gehäkelter Pudel, der Handy, Schlüssel und Lippenstift trägt und mit seinem eigenen kleinen Kamm kommt.</p>
<p>Hui häkelt jeden Pudel aus weichem Plüschgarn und setzt ihm zum Schluss drei winzige Haarspangen auf den Kopf. Wenn eine volle Woche das Fell plattgedrückt hat, bringen ein paar Striche mit dem Kamm es zurück.</p>
<ul>
<li><strong>Für das Nötigste:</strong> Handy, Lippenstift, Taschentücher, Schlüssel und eine Fahrkarte, so kann die große Tasche zu Hause bleiben.</li>
<li><strong>110 cm verstellbarer Gurt:</strong> quer über dem Körper mit freien Händen, oder kürzer über der Schulter.</li>
<li><strong>Knopfverschluss:</strong> alles bleibt, wo es ist, wenn du unterwegs bist.</li>
<li><strong>Rund 120 g:</strong> du merkst sie kaum.</li>
<li><strong>Drei Farben:</strong> Honiggelb, Cremeweiß oder Karamell.</li>
</ul>
<p>Für Kinder ist sie eine stolze erste eigene Tasche für Münzen, kleines Spielzeug und Süßigkeiten. Für Erwachsene ist sie ein weiches, albernes Stück Freude an einem grauen Tag.</p>
<p><em>Unten B 17 cm, oben B 14 cm, H 15 cm, T 1 cm. Von Hand gemessen, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Ist sie für Kinder geeignet?', a: 'Ja. Kinder bewahren darin Münzen, kleines Spielzeug und Süßigkeiten auf, und der 110-cm-Gurt lässt sich anpassen.' },
      { q: 'Wie bleibt sie flauschig?', a: 'Bürste sie sanft mit dem kleinen Kamm, der dabei ist.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser unter 40 °C waschen und flach liegend trocknen.' },
    ],
    option: { name: 'Farbe', values: { 'Honey Yellow': 'Honiggelb', 'Cream White': 'Cremeweiß', Caramel: 'Karamell' } },
    materials: ['Polyester'],
    size: 'Unten B 17 × oben B 14 × H 15 × T 1 cm, Gurt 110 cm',
    alts: [
      'Flauschige gelbe gehäkelte Pudeltasche mit pastellfarbenen Haarspangen, Nahaufnahme',
      'Drei flauschige gehäkelte Pudeltaschen in Karamell, Weiß und Gelb auf einem Regal',
      'Gelbe flauschige gehäkelte Pudeltasche quer über einem braunen Pullover getragen',
    ],
  },
  'granny-square-flower-crossbody-bag': {
    name: 'Granny-Square-Blumentasche mit Rüschen',
    seoTitle: 'Gehäkelte Granny-Square-Umhängetasche mit Blumen und Rüschenrand',
    body: `<p>Vier gehäkelte Blumenfelder und ein gewellter Rüschenrand machen aus einer kleinen Alltagstasche etwas, worauf Leute dich ansprechen.</p>
<p>Hui häkelt vier Granny-Square-Felder pro Seite, setzt in jede Mitte eine kräftige Blume, schließt den Rand mit einer Rüsche ab und füttert die Tasche innen mit Polyester, mit einem Handyfach und einem Dokumentenfach.</p>
<ul>
<li><strong>Zwei Arten zu tragen:</strong> an den eingearbeiteten Henkeln mit Griffloch, oder hak den abnehmbaren gehäkelten Gurt ein und trag sie quer über dem Körper.</li>
<li><strong>Gefüttert, mit Handyfach und Dokumentenfach:</strong> hält kleine Dinge geordnet.</li>
<li><strong>Oben offen, ohne Reißverschluss oder Knopf:</strong> schnell rein, schnell raus.</li>
<li><strong>Rund 140 g:</strong> leicht für jeden Tag.</li>
<li><strong>Vier Farbvarianten:</strong> Beige mit weißen und orangefarbenen Blumen, Orange mit gelben und blauen, Lila mit Lavendel, Weiß und Grün, oder Rosa mit Rosa und Grün.</li>
</ul>
<p>Gemacht für Handy, Karten, Lippenpflege, Schlüssel und Taschentücher, keine große Tasche, nur für die kleinen Dinge, die du wirklich dabeihast. Ein farbenfrohes, handgemachtes Geschenk für alle, die den Cottagecore-Stil mögen.</p>
<p><em>Rund 140 g, mit goldfarbenen Beschlägen am abnehmbaren Gurt. Von Hand gehäkelt, daher weichen die Position der Blumen und die Form der Rüsche von Tasche zu Tasche leicht ab.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Karten, Lippenpflege, Schlüssel und Taschentücher, dank des gefütterten Handy- und Dokumentenfachs.' },
      { q: 'Kann ich sie auf zwei Arten tragen?', a: 'Ja. Nimm die eingearbeiteten Henkel, oder hak den abnehmbaren Gurt ein und trag sie quer über dem Körper.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in warmem Wasser unter 40 °C mit mildem Waschmittel waschen, nicht auswringen oder verdrehen und flach liegend trocknen.' },
    ],
    option: { name: 'Farbe', values: { Pink: 'Rosa', Beige: 'Beige', Orange: 'Orange', Purple: 'Lila' } },
    materials: ['Acryl'],
    alts: [
      'Rosa gehäkelte Granny-Square-Tasche mit vier Blumenfeldern, quer über dem Körper getragen',
      'Beige gehäkelte Granny-Square-Tasche mit weißen und orangefarbenen Blumen, quer über dem Körper getragen',
      'Orangefarbene gehäkelte Granny-Square-Tasche mit gelben und blauen Blumen, quer über dem Körper getragen',
    ],
  },
  'hot-air-balloon-crossbody-bag': {
    name: 'Regenbogen-Heißluftballon-Tasche',
    seoTitle: 'Gehäkelte Heißluftballon-Umhängetasche mit Regenbogenstreifen',
    body: `<p>Eine Heißluftballon-Tasche, die sich beim Füllen wirklich ausdehnt, mit allen Regenbogenstreifen, und deshalb mehr trägt, als man ihr ansieht.</p>
<p>Hui häkelt jeden Streifen von Hand, Reihe für Reihe, und wechselt dabei die Farbe des Acrylgarns, um den Verlauf aufzubauen. Oben schließt sie die Tasche mit einem cremefarbenen Knopf und einem handgeflochtenen orangefarbenen Gurt, der sich ein- und aushaken lässt.</p>
<ul>
<li><strong>Dehnt sich beim Füllen:</strong> die Ballonform fasst mehr, als es von außen aussieht.</li>
<li><strong>Für ein Smartphone, eine schmale Geldbörse, Münzen, Schlüssel, Lippenpflege, Kopfhörer und eine zusammengeklappte Sonnenbrille.</strong></li>
<li><strong>60 cm geflochtener Gurt mit Metallkarabinern:</strong> verstell ihn oder nimm ihn ab.</li>
<li><strong>Cremefarbener Knopf als Verschluss und ein kleines Lederschild „Hand Made“ vorne.</strong></li>
<li><strong>Rund 90 g:</strong> leicht für einen Festival- oder Reisetag.</li>
</ul>
<p>Gemacht für Festivals, Konzerte und Reisetage, an denen du die Hände frei haben willst, und ein echt handgemachtes Geschenk für alle, die Dinge schätzen, die ein Mensch gemacht hat, keine Maschine.</p>
<p><em>H 16 cm, B 7 bis 11 cm je nach Inhalt, Gurt 60 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung, und bei jedem Ballon fallen die Streifen ein wenig anders.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Smartphone, eine schmale Geldbörse, Münzen, Schlüssel, Lippenpflege, Kopfhörer und eine zusammengeklappte Sonnenbrille. Die Ballonform fasst mehr, als man denkt.' },
      { q: 'Kann ich den Gurt abnehmen?', a: 'Ja. Der geflochtene Gurt wird mit Metallkarabinern eingehakt, du kannst ihn also verstellen oder abnehmen.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem bis warmem Wasser unter 40 °C mit mildem Waschmittel waschen, von rauen Stoffen und Reißverschlüssen fernhalten und flach liegend trocknen.' },
    ],
    materials: ['Garn aus Polyester und Acryl', 'Metall'],
    size: 'B 7–11 × H 16 cm, Gurt 60 cm',
    alts: [
      'Regenbogengestreifte gehäkelte Heißluftballon-Tasche mit einem Handy darin',
      'Regenbogengestreifte gehäkelte Heißluftballon-Tasche mit geflochtenem orangefarbenem Umhängegurt',
      'Regenbogengestreifte gehäkelte Heißluftballon-Tasche an ihrem geflochtenen Gurt hängend',
    ],
  },
  '3d-flower-crochet-phone-bag': {
    name: 'Handytasche mit 3D-Rose oder Sonnenblume',
    seoTitle: 'Gehäkelte Handytasche mit 3D-Blume, Rose oder Sonnenblume, zum Umhängen',
    body: `<p>Eine gehäkelte Handytasche mit einer plastisch geformten Blume vorne, groß genug, um aufzufallen, klein genug für jeden Tag.</p>
<p>Hui häkelt die Sonnenblume in Lagen aus gelben Blütenblättern mit brauner Mitte, oder formt die Rose Blatt für Blatt in zartem Rosa, und näht sie dann auf eine cremefarbene Tasche mit grünem Stiel und Blättern. Ein Kordelzug schließt die Tasche oben, und ein Karabiner hält den Gurt sicher.</p>
<ul>
<li><strong>Für Handys bis 6,5 Zoll:</strong> dazu ein flaches Kartenetui, Schlüssel, Lippenpflege und Kopfhörer.</li>
<li><strong>110 cm verstellbarer Gurt:</strong> mit Karabiner, quer über dem Körper oder über der Schulter.</li>
<li><strong>Kordelzug:</strong> zuziehen zum Schließen, lockern zum Hineingreifen.</li>
<li><strong>Zwei Designs:</strong> gelagerte Sonnenblume oder gewundene Rose.</li>
<li><strong>Rund 80 g:</strong> so leicht, dass du sie vergisst.</li>
</ul>
<p>Eine hübsche Alltagstasche für alle, die Blumen an ihrem Outfit mögen, oder ein Frühlingsgeschenk, das direkt getragen werden kann.</p>
<p><em>B 12 × H 18 × T 1 cm, Gurt 110 cm. Jede Blume wird von Hand geformt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Handys bis 6,5 Zoll passen, mit Platz für ein Kartenetui, Schlüssel, Lippenpflege und Kopfhörer.' },
      { q: 'Was ist der Unterschied zwischen den beiden Designs?', a: 'Die Sonnenblume hat gelagerte gelbe Blütenblätter mit brauner Mitte. Die Rose hat spiralförmig gewundene rosa Blütenblätter. Beide sitzen auf einer cremefarbenen Tasche mit grünem Stiel und Blättern.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand oder im Schonwaschgang in kühlem Wasser unter 40 °C waschen, getrennt von dunklen Farben, flach liegend trocknen und nicht in den Trockner.' },
    ],
    option: { name: 'Farbe', values: { Rose: 'Rose', Sunflower: 'Sonnenblume' } },
    materials: ['Garn aus Polyester und Acryl'],
    size: 'B 12 × H 18 × T 1 cm, Gurt 110 cm',
    alts: [
      'Gehäkelte Handytaschen mit 3D-Sonnenblume und 3D-Rose nebeneinander',
      'Cremefarbene gehäkelte Handytasche mit großer rosa 3D-Rose und grünen Blättern',
      'Cremefarbene gehäkelte Handytasche mit großer gelber 3D-Sonnenblume und Stiel',
    ],
  },
  'bear-phone-bag': {
    name: 'Bären-Handytasche mit Schal',
    seoTitle: 'Gehäkelte Bären-Handytasche mit gestreiftem Schal, für Kinder und Erwachsene',
    body: `<p>Ein handgehäkelter Bär mit gestreiftem Schal und seiner eigenen winzigen Umhängetasche, klein genug, dass Kinder und Erwachsene ihn auf dieselbe Weise tragen können.</p>
<p>Hui häkelt den Bären aus weichem Polyestergarn, deshalb wird das Fell leicht noppig statt glatt, und ergänzt einen rot-weiß gestreiften Schal und eine petrolfarbene Umhängetasche mit orangefarbenem Knopf. Das lächelnde Maul des Bären ist die Öffnung, ein Handy oder ein paar Münzen gleiten also direkt hinein.</p>
<ul>
<li><strong>Für Handy, Lippenstift, Taschentücher, Schlüssel oder eine Fahrkarte:</strong> auch mit Platz für Münzen und kleines Spielzeug.</li>
<li><strong>104 cm Gurt:</strong> zum Umhängen für Kinder, Teenager oder Erwachsene.</li>
<li><strong>Rund 70 g:</strong> leicht genug, dass ein Kind ihn den ganzen Tag tragen kann.</li>
<li><strong>Zwei Farbvarianten:</strong> Hellbraun oder dunkles Kaffeebraun.</li>
<li><strong>Gestreifter Schal und Umhängetasche:</strong> aufgenäht, für mehr Charakter.</li>
</ul>
<p>Eine erste Tasche für ein kleines Kind, das aus dem Rucksack herauswächst, oder ein weiches, lustiges Geschenk für alle, die Handgemachtes mögen.</p>
<p><em>Unten B 11 cm, oben B 9 cm, H 20 cm, T 2 cm, Gurt 104 cm. Jeder Bär ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung und kleinen Unterschieden im Schalmuster.</em></p>`,
    faq: [
      { q: 'Ist er für Kinder geeignet?', a: 'Ja. Mit rund 70 g ist er leicht genug, dass Kinder darin Münzen, kleines Spielzeug oder Süßigkeiten tragen, und Erwachsene nutzen ihn für Handy und das Nötigste.' },
      { q: 'Wie geht er auf?', a: 'Über das lächelnde Maul des Bären, dort kommen Handy oder kleine Dinge hinein.' },
      { q: 'Wie wasche ich ihn?', a: 'Von Hand in kühlem oder lauwarmem Wasser unter 40 °C waschen und flach liegend trocknen, nicht in der prallen Sonne.' },
    ],
    option: { name: 'Farbe', values: { 'Light Brown': 'Hellbraun', 'Dark Brown': 'Dunkelbraun' } },
    materials: ['Polyester'],
    size: 'B 11 × H 20 × T 2 cm, Gurt 104 cm',
    alts: [
      'Braune gehäkelte Bären-Handytasche mit gestreiftem Schal, quer über dem Körper getragen, von hinten',
      'Braune gehäkelte Bären-Handytasche mit petrolfarbener Umhängetasche, Nahaufnahme, umgehängt',
      'Braune gehäkelte Bären-Handytasche quer über dem Körper getragen, von der Seite',
    ],
  },
  'blue-stripe-tote-bag-with-flower-charm': {
    name: 'Blau gestreifte Tasche mit Blumenanhänger',
    seoTitle: 'Gehäkelte Tasche mit blauen Streifen und Blumenanhänger, Schultertasche',
    body: `<p>Eine gestreifte Häkeltasche, geräumig genug für ein iPad, mit einem abnehmbaren Blumenanhänger, den du nach Lust an- oder abmachst.</p>
<p>Hui häkelt den Korpus aus cremefarbenem Acrylgarn mit blauen Streifen in festen und durchbrochenen Reihen und arbeitet den Boden flach genug, dass die Tasche gefüllt von selbst steht. An einer geflochtenen Kordel hängen eine gehäkelte marineblaue Blume mit weißer Mitte und ein marineblau-cremefarbener Smiley-Anhänger, an den Henkel gebunden, und oben ist ein „Hand made“-Etikett aus Kunstleder aufgenäht.</p>
<ul>
<li><strong>Für ein iPad, ein Handy, ein Taschenbuch, einen kleinen Regenschirm und eine Geldbörse.</strong></li>
<li><strong>Magnetverschluss:</strong> damit nichts herausrutscht.</li>
<li><strong>Abnehmbarer Blumen- und Smiley-Anhänger:</strong> 40 cm geflochtene Kordel, in Sekunden an oder ab.</li>
<li><strong>30 cm Henkelhöhe:</strong> sitzt auf der Schulter oder in der Armbeuge.</li>
<li><strong>Rund 140 g insgesamt:</strong> leicht für das, was hineinpasst.</li>
</ul>
<p>Eine Alltagstasche für den Weg zur Arbeit, den Markt oder den Kaffee zwischendurch, und ein schönes Geschenk für alle, die ein bisschen Charme an ihrer Tasche mögen.</p>
<p><em>B 25 × H 27 × T 6 cm, Henkelhöhe 30 cm. Jede Tasche ist von Hand gehäkelt, daher weichen Maschenspannung und Form des Anhängers leicht ab.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein iPad, ein Handy, ein Taschenbuch, ein kleiner Regenschirm, eine Geldbörse und eine Trinkflasche, wenn du es nicht übertreibst.' },
      { q: 'Kann ich den Anhänger abnehmen?', a: 'Ja. Die Blume hat rund 9 cm Durchmesser, der Smiley-Anhänger rund 4,5 cm. Beide sind an einer geflochtenen Kordel an den Henkel gebunden und lassen sich jederzeit abnehmen.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder warmem Wasser unter 40 °C waschen, flach liegend trocknen und den Magnetverschluss danach gut abtrocknen.' },
    ],
    materials: ['Metall', 'Acryl'],
    size: 'B 25 × H 27 × T 6 cm, Henkel 30 cm',
    alts: [
      'Frau trägt eine creme-blau gestreifte Häkeltasche auf der Schulter',
      'Creme-blau gestreifte Häkeltasche mit marineblauer Blume und Smiley-Anhänger',
      'Creme-blau gestreifte Häkeltasche flach ausgelegt, die Anhänger daneben',
    ],
  },
  'blue-stripe-tote-bag-with-removable-flower-charm': {
    name: 'Blau gestreifte Tasche mit Blumen- und Herzanhänger',
    seoTitle: 'Gehäkelte Tasche mit marineblauen Streifen, abnehmbarer Blume und Herz',
    body: `<p>Eine gestreifte Häkeltasche mit abnehmbarem Blumen- und Herzanhänger, geräumig genug für ein Tablet und das Nötigste.</p>
<p>Hui häkelt den Korpus aus cremefarbenem Garn mit marineblauen Streifen in einem luftigen Muster und arbeitet den Boden 6 cm breit, so steht die Tasche von selbst. An einer geflochtenen Kordel hängen eine kräftige blaue Blume mit cremefarbener Mitte und ein gefülltes cremefarbenes Herz, und der Anhänger lässt sich abnehmen, wenn du die Tasche lieber schlicht trägst. Oben sitzt ein kleines hellbraunes „Hand made“-Etikett in Lederoptik.</p>
<ul>
<li><strong>Für ein iPad, ein Taschenbuch, ein Handy, einen Regenschirm und Schlüssel.</strong></li>
<li><strong>Abnehmbarer Blumen- und Herzanhänger:</strong> 40 cm Kordel, an oder ab.</li>
<li><strong>30 cm Henkelhöhe:</strong> bequem für einen ganzen Tag unterwegs.</li>
<li><strong>Rund 140 g insgesamt,</strong> Tasche plus Anhänger.</li>
</ul>
<p>Eine Tagestasche für den Arbeitsweg, Märkte oder ein Wochenende weg, und ein liebevolles Geschenk für alle, die einen kleinen Anhänger genauso mögen wie die Tasche.</p>
<p><em>B 25 × H 27 × T 6 cm, Henkelhöhe 30 cm. Jede Tasche ist von Hand gehäkelt, daher weichen die Proportionen leicht ab.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein iPad, ein Taschenbuch, ein Handy, ein Regenschirm, Schlüssel und ein paar Kleinigkeiten für jeden Tag.' },
      { q: 'Kann ich den Anhänger abnehmen?', a: 'Ja. Die Blume hat rund 9 cm Durchmesser. Sie und das Herz hängen an einer geflochtenen Kordel und lassen sich leicht abnehmen, wenn du die Tasche lieber schlicht magst.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser bis 40 °C waschen, flach liegend trocknen und nicht lange in die direkte Sonne legen.' },
    ],
    materials: ['Garn aus Polyester und Acryl', 'Metall'],
    size: 'B 25 × H 27 × T 6 cm, Henkel 30 cm',
    alts: [
      'Creme-marineblau gestreifte Häkeltasche mit Blumen- und Herzanhänger, hängend',
      'Creme-marineblau gestreifte Häkeltasche auf einem Stuhl, mit „Hand made“-Etikett',
      'Abnehmbare marineblaue Blume und cremefarbenes Herz an einer geflochtenen Kordel',
    ],
  },
  'bunny-crossbody-bag': {
    name: 'Regenbogen-Hasentasche mit Karotte',
    seoTitle: 'Gehäkelte Hasen-Umhängetasche mit Regenbogenstreifen und Karotte',
    body: `<p>Eine handgehäkelte Hasentasche, die sich über das Maul öffnet, mit einem regenbogengestreiften Körper und einer winzigen Karotte in der Pfote.</p>
<p>Hui häkelt die Ohren lang und rosa, setzt dem Kopf gelbe Lockenhaare, eine grüne Blume und rote Sicherheitsaugen auf und arbeitet den Körper in waagerechten Regenbogenstreifen. Ein kleiner gehäkelter Pilzanhänger und eine Karotte in einer Pfote vervollständigen den Look, und das breite Maul ist gleichzeitig die Öffnung.</p>
<ul>
<li><strong>Für ein Handy, ein flaches Kartenetui, gefaltete Scheine, Lippenpflege, Schlüssel und Kopfhörer.</strong></li>
<li><strong>116 cm verstellbarer Gurt:</strong> quer über dem Körper oder über der Schulter.</li>
<li><strong>Breites Maul als Öffnung:</strong> direkt hineingreifen, ohne Reißverschluss oder Druckknopf.</li>
<li><strong>Rund 100 g:</strong> leicht genug für den ganzen Tag.</li>
<li><strong>Karotten- und Pilzanhänger:</strong> kleine Details, die jeden Hasen einzigartig machen.</li>
</ul>
<p>Eine verspielte Umhängetasche für alle, die Kidcore- oder Cottagecore-Stil mögen, und ein lustiges Geschenk für Freundinnen, die schräge kleine Figuren sammeln.</p>
<p><em>Oben B 11 cm, unten B 12 cm, H 29 cm, T 1 cm, Gurt 116 cm. Jeder Hase ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung und kleinen Unterschieden zwischen den Taschen.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Ja, zusammen mit einem flachen Kartenetui, gefalteten Scheinen, Lippenpflege, Schlüsseln und Kopfhörern.' },
      { q: 'Wie geht sie auf?', a: 'Über das breite rosa Maul oben. Kein Reißverschluss, kein Knopf, einfach hineingreifen und wieder zustecken.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser unter 40 °C waschen, feucht sanft in Form ziehen und flach liegend trocknen.' },
    ],
    materials: ['Garn aus Polyester und Acryl'],
    size: 'B 12 × H 29 × T 1 cm, Gurt 116 cm',
    alts: [
      'Rosa gehäkelte Hasentasche mit regenbogengestreiftem Körper und Karotte in der Pfote, hängend',
      'Rosa gehäkelte Hasentasche von vorne, mit Maulöffnung und Pilzanhänger',
      'Rosa gehäkelte Hasentasche quer über dem Körper getragen, von hinten',
    ],
  },
  'burger-monster-crossbody-bag': {
    name: 'Monster-Umhängetasche mit Lockenkopf',
    seoTitle: 'Gehäkelte Monster-Umhängetasche mit Locken und Streifen',
    body: `<p>Ein handgehäkeltes Monster mit Lockenkopf, großem roten Maul und gestreiftem Körper, das aussieht wie nichts anderes in deiner Taschenschublade.</p>
<p>Hui setzt dem gelben Kopf Lockenhaare aus Schlingenmaschen auf, platziert zwei weiße Wackelaugen über einem dicken roten Maul und häkelt den Körper dann in waagerechten Streifen, die von Gelb über Rost, Koralle, Grün und gesprenkeltes Creme bis Zitronengelb wechseln. Es gibt keinen Reißverschluss und keinen Knopf, du greifst einfach am Maul vorbei hinein.</p>
<ul>
<li><strong>Für ein Handy, Schlüssel, Lippenpflege, Karten und ein paar Münzen.</strong></li>
<li><strong>120 cm Gurt mit Metallkarabinern:</strong> quer über dem Körper oder über der Schulter.</li>
<li><strong>Offenes Maul oben:</strong> kein Reißverschluss zum Herumfummeln.</li>
<li><strong>Rund 110 g:</strong> so leicht, dass du sie vergisst.</li>
<li><strong>Baumelnde Arme und Beine:</strong> bewegen sich beim Gehen, und genau das macht Spaß.</li>
</ul>
<p>Ein Gesprächsstarter für Märkte, den Schulweg oder das Café, und ein lustiges Geschenk für alle, die schräge kleine Wesen lieber mögen als eine schlichte Handtasche.</p>
<p><em>Oben B 12 cm, unten B 14 cm, H 27 cm, T 1 cm, Gurt 120 cm. Jedes Monster ist von Hand gehäkelt, daher weichen Streifenbreite, Armlänge und Gesicht von Tasche zu Tasche leicht ab.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Schlüssel, Lippenpflege, Karten und ein paar Münzen. Nur kleine Dinge.' },
      { q: 'Wie geht sie auf?', a: 'Es gibt keinen Reißverschluss und keinen Knopf. Du greifst oben am Maul vorbei hinein.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand oder im Schonwaschgang unter 40 °C waschen, getrennt von dunklen Farben, feucht in Form ziehen und flach liegend trocknen.' },
    ],
    materials: ['Polyester'],
    size: 'B 14 × H 27 × T 1 cm, Gurt 120 cm',
    alts: [
      'Gelbe gehäkelte Monstertasche mit Lockenkopf und gestreiftem Körper, quer über dem Körper getragen',
      'Gelbe gehäkelte Monstertasche in Nahaufnahme mit Wackelaugen und rotem Maul',
      'Gelbe gehäkelte Monstertasche quer über dem Körper getragen, von hinten auf einer Treppe',
    ],
  },
  'camellia-granny-square-bag': {
    name: 'Granny-Square-Täschchen mit Kamelie',
    seoTitle: 'Gehäkeltes Granny-Square-Täschchen mit 3D-Kamelie und Kordelzug',
    body: `<p>Ein gehäkeltes Täschchen mit einer vollen 3D-Kamelienblüte vorne, gemacht, um wirklich Handy und Schlüssel zu tragen, nicht nur hübsch im Regal zu stehen.</p>
<p>Hui häkelt jede Tasche im Granny-Square-Muster mit einem luftigen Muschelmuster in der unteren Hälfte, baut die Kamelie in spiralförmigen Lagen auf und näht sie von Hand auf eine Blattbasis. Eine passende Blütenknospe sitzt an der grünen Kordel, die den gewellten Rand zusammenzieht.</p>
<ul>
<li><strong>3D-Kamelie:</strong> von Hand geschichtete Blütenblätter machen die Blume zum echten Mittelpunkt, kein flacher Aufnäher.</li>
<li><strong>Kordelzug:</strong> eine grüne Kordel läuft durch den gewellten Rand und zieht ihn zu, so fällt nichts heraus.</li>
<li><strong>Geflochtener cremefarbener Gurt:</strong> verstellbar, quer über dem Körper oder über der Schulter.</li>
<li><strong>Für Handy, Kartenetui, Lippenpflege und Schlüssel:</strong> genug für einen Abend ohne große Tasche.</li>
<li><strong>Vier Blütenfarben:</strong> Rot, Salbeigrün, Rosa oder Orange, alle auf cremefarbenem Grund.</li>
</ul>
<p>Eine hübsche, praktische Wahl für alle, die Blumen ohne viel Aufwand wollen, und ein einfaches Geschenk für eine Freundin, die den Cottagecore-Stil mag.</p>
<p><em>Oben B 12 cm, unten B 16 cm, H 15 cm. Jede Tasche ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, ein Kartenetui, Lippenpflege und Schlüssel passen bequem hinein, das Nötigste für jeden Tag.' },
      { q: 'Wie wasche ich es?', a: 'Sanft von Hand in kühlem Wasser mit milder Seife waschen, nicht auswringen und flach liegend trocknen. Nicht in die Waschmaschine oder den Trockner.' },
      { q: 'Kann ich es über der Schulter tragen?', a: 'Ja. Der geflochtene Kordelgurt lässt sich für quer über dem Körper oder über der Schulter verstellen.' },
    ],
    option: { name: 'Farbe', values: { Red: 'Rot', Green: 'Grün', Pink: 'Rosa', Orange: 'Orange' } },
    materials: ['Polyester'],
    size: 'B 16 × H 15 cm',
    alts: [
      'Vier gehäkelte Granny-Square-Täschchen mit orangefarbener, grüner, rosa und roter 3D-Blume',
      'Cremefarbenes Granny-Square-Täschchen mit großer roter 3D-Kamelie und Knospenanhänger',
      'Cremefarbenes Granny-Square-Täschchen mit großer grüner 3D-Kamelie und Knospenanhänger',
    ],
  },
  'clown-crossbody-phone-bag': {
    name: 'Clown-Handytasche mit Spitzhut',
    seoTitle: 'Gehäkelte Clown-Handytasche mit Spitzhut, zum Umhängen',
    body: `<p>Diese Clowntasche mit Zahngrinsen und Spitzhut macht aus einer langweiligen Besorgung etwas, wofür Leute dich anhalten.</p>
<p>Hui häkelt das runde rote Gesicht mit cremefarbener Mitte, schwarzen Perlenaugen, einer roten Bommelnase und einem weißen Zickzackmund mit spitzen Zähnen und ergänzt einen blauen Spitzhut, orangefarbene Knöpfe und grüne Flicken auf der blauen Latzhose. Der Gurt ist eine gedrehte grün-schwarze Kordel, fest 120 cm lang.</p>
<ul>
<li><strong>Zahngrinsen und Bommelnase:</strong> ein Gesicht, das auffällt und in Erinnerung bleibt.</li>
<li><strong>120 cm fester Gurt:</strong> quer über dem Körper oder über einer Schulter.</li>
<li><strong>Oben offen, ohne Verschluss:</strong> Handy, Karten oder Schlüssel einfach hineinstecken.</li>
<li><strong>B 10 × H 20 × T 2 cm:</strong> schmal genug für ein Handy und ein paar Extras, nicht für ein iPad.</li>
<li><strong>Rund 80 g:</strong> den ganzen Tag leicht auf der Schulter.</li>
</ul>
<p>Eine lustige Tasche für Märkte und Besorgungen, und ein Geburtstags- oder Nikolausgeschenk für alle, die ihre Accessoires schräg und laut mögen.</p>
<p><em>B 10 × H 20 × T 2 cm, Gurt 120 cm. Jeder Clown ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, ein paar Karten, Lippenpflege, Schlüssel oder ein paar Münzen. Für ein iPad oder ein Buch ist sie zu schmal.' },
      { q: 'Ist sie für Kinder geeignet?', a: 'Ja. Der 120-cm-Gurt passt bei Erwachsenen quer über dem Körper und sitzt auch bei Kindern gut.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser unter 40 °C waschen, feucht in Form ziehen und flach liegend trocknen.' },
    ],
    materials: ['Acryl'],
    size: 'B 10 × H 20 × T 2 cm, Gurt 120 cm',
    alts: [
      'Rot-blaue gehäkelte Clown-Handytasche quer über dem Körper getragen, von hinten',
      'Gehäkelte Clown-Handytasche mit Zahngrinsen und blauer Latzhose, Nahaufnahme',
      'Gehäkelte Clown-Handytasche quer über einem weißen Hemd getragen, von vorne',
    ],
  },
  'crab-crossbody-bag-with-x-eyes': {
    name: 'Krabben-Umhängetasche mit X-Augen',
    seoTitle: 'Gehäkelte Krabben-Umhängetasche mit X-Augen, Rot oder Braun',
    body: `<p>Große weiße X-Augen und dicke Scheren machen diese Krabbentasche unübersehbar, und trotzdem trägt sie Lippenstift, Karten und Schlüssel.</p>
<p>Hui häkelt den Panzer in einer Spiralmasche und formt dann zwei Noppenaugen mit schwarzen X-Pupillen und zwei dicke Scheren, die zur Seite abstehen. Die Öffnung oben ziehst du mit der Hand auseinander, es gibt keinen Reißverschluss und keinen Knopf.</p>
<ul>
<li><strong>Noppenaugen mit X-Pupillen:</strong> das Detail, für das man zweimal hinschaut.</li>
<li><strong>118 cm gehäkelter Gurt:</strong> quer über dem Körper oder über einer Schulter.</li>
<li><strong>Für ein Kosmetikdöschen, Lippenstift, Schlüssel, Karten und Münzen:</strong> kleinere Handys passen eventuell, mit einem großen Handy liegt sie aber nicht flach.</li>
<li><strong>Zwei Farben:</strong> Rot mit rotem Gurt oder Braun mit braunem Gurt und beigen Scherenspitzen.</li>
<li><strong>Rund 100 bis 150 g:</strong> solide, ohne dich zu beschweren.</li>
</ul>
<p>Eine alberne, einprägsame Umhängetasche für Kinder oder Erwachsene, und ein lustiges Geburtstagsgeschenk für Meeresfans oder Krabbenliebhaber.</p>
<p><em>Oben B 21 cm von Schere zu Schere, unten B 15 cm Körper, H 10 cm, T 3 cm, Gurt 118 cm. Jede Krabbe ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Sie hält ein Kosmetikdöschen, Lippenstift, Schlüssel, Karten und Münzen. Kleinere Handys passen eventuell, mit einem großen Handy liegt sie aber nicht flach.' },
      { q: 'Wie wird sie geschlossen?', a: 'Es gibt keinen Reißverschluss und keinen Knopf. Zieh den Panzer mit der Hand auseinander, um hineinzugreifen.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser mit mildem Waschmittel waschen, Scheren und Augen feucht in Form bringen und flach liegend trocknen.' },
    ],
    option: { name: 'Farbe', values: { Red: 'Rot', Brown: 'Braun' } },
    materials: ['Acryl'],
    size: 'B 21 × H 10 × T 3 cm, Gurt 118 cm',
    alts: [
      'Braune gehäkelte Krabben-Umhängetasche mit weißen X-Augen, an der Hüfte getragen',
      'Rote gehäkelte Krabben-Umhängetasche mit weißen X-Augen, an der Hüfte getragen',
      'Braune gehäkelte Krabben-Umhängetasche mit hellbraunen Scheren, über einem Kapuzenpulli getragen',
    ],
  },
  'daisy-granny-square-tote-bag-with-matching-coin': {
    name: 'Gänseblümchen-Granny-Square-Tasche mit Geldbörse',
    seoTitle: 'Gehäkelte Granny-Square-Tasche mit Gänseblümchen und passender Geldbörse',
    body: `<p>Eine geräumige Häkeltasche aus sieben Gänseblümchen-Granny-Squares, mit passender Geldbörse, die sich direkt an den Henkel klipsen lässt.</p>
<p>Hui verbindet sieben Gänseblümchen-Quadrate, jedes mit goldener Mitte, weißen Blütenblättern und himmelblauem Innenrand, mit beigen Streifen in Kreuzform und schließt den oberen Rand mit geflochtenen Baumwollkordel-Henkeln ab. Die Geldbörse ist ein einzelnes Gänseblümchen-Quadrat mit limettengrünem Rand und eigener Schlaufe.</p>
<ul>
<li><strong>Für ein 11-Zoll-Tablet, Bücher oder eine Trinkflasche:</strong> geräumig genug für einen ganzen Tag unterwegs.</li>
<li><strong>Geflochtene Baumwollkordel-Henkel:</strong> in verstärkte Randmaschen eingenäht, 30 cm Henkelhöhe.</li>
<li><strong>Passende Geldbörse:</strong> rund 10 × 10 cm mit 6 cm Schlaufe, für Münzen, Karten, Lippenpflege oder Kopfhörer, lässt sich an den Henkel oder deinen Schlüsselbund klipsen.</li>
<li><strong>Baumwollgarn:</strong> Quadrat für Quadrat in klassischer Granny-Square-Technik gehäkelt.</li>
<li><strong>Rund 0,42 kg:</strong> solide, ohne leer schwer zu wirken.</li>
</ul>
<p>Eine unkomplizierte Tasche für Märkte, den Strand oder die Bibliothek, und ein hübsches Geschenk für Cottagecore-Fans.</p>
<p><em>B 34 × H 36 × T 2 cm, Henkel 30 cm. Jedes Quadrat wird von Hand gehäkelt und verbunden, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Tablets bis etwa 11 Zoll, Bücher, eine Trinkflasche mit 500 bis 750 ml, Geldbörse, Handy, Schlüssel und Sonnenbrille.' },
      { q: 'Wofür ist die kleine Geldbörse?', a: 'Für Münzen, Schlüssel, Lippenpflege, Kopfhörer oder Karten. Klips sie an den Henkel der Tasche, an deinen Schlüsselbund oder trag sie allein.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser unter 30 °C waschen, die Geldbörse separat, um den grünen Rand zu schonen, flach liegend trocknen, nicht in die Maschine, nicht in den Trockner und kein Bleichmittel.' },
    ],
    materials: ['Baumwolle'],
    size: 'B 34 × H 36 × T 2 cm, Henkel 30 cm',
    alts: [
      'Blau-weiß-beige Granny-Square-Tasche mit Gänseblümchen, auf einer Bank hängend',
      'Frau am Strand mit Gänseblümchen-Granny-Square-Tasche und passender Geldbörse',
      'Frau im Park mit Gänseblümchen-Granny-Square-Tasche über der Schulter',
    ],
  },
  'flower-coaster-with-stem-and-leaves': {
    name: 'Blumen-Untersetzer mit Stiel, 4er-Set',
    seoTitle: 'Gehäkelte Blumen-Untersetzer mit Stiel und Blättern, 4er-Set in vier Farben',
    body: `<p>Vier gehäkelte Blumen-Untersetzer fangen jeden Rand auf, den deine Tassen sonst auf dem Tisch hinterlassen würden, je einer in vier kräftigen Farbvarianten.</p>
<p>Hui formt jeden Untersetzer zu fünf gewellten Blütenblättern um eine kontrastfarbene Mitte und gibt ihm einen 4 cm langen grünen Stiel mit zwei kleinen Blättern. Er hat 15 cm Durchmesser und ist rund 0,5 cm dick, mit gerade genug Wölbung, um flach und stabil unter einer Tasse oder Kerze zu liegen.</p>
<ul>
<li><strong>Set aus vier Farbvarianten:</strong> Rot mit cremefarbenem Rand, Blau mit Petrol, Rosa mit Salbeigrün und Gelb mit rotem Rand, je einer.</li>
<li><strong>Gewellter Blütenrand:</strong> fängt Tropfen auf, bevor sie das Holz erreichen.</li>
<li><strong>Rund 20 g:</strong> leicht, aber solide genug, um liegen zu bleiben.</li>
<li><strong>Stiel und Blätter:</strong> ein kleines dekoratives Detail, auch wenn keine Tasse darauf steht.</li>
</ul>
<p>Ein kleines, liebevolles Geschenk für alle, die Handgemachtes für die Küche mögen, und eine einfache Kleinigkeit für den Nikolausstiefel oder zur Einweihung.</p>
<p><em>Je Ø 15 cm. Jeder Untersetzer ist von Hand gehäkelt, rechne also mit 1 bis 2 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Wie viele Untersetzer bekomme ich?', a: 'Vier Untersetzer, je einer in jeder Farbvariante: Rot, Blau, Rosa und Gelb.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand unter 40 °C waschen, flach liegend trocknen und nicht lange in die direkte Sonne legen.' },
      { q: 'Welche Farben gibt es?', a: 'Rote Blütenblätter mit cremefarbenem Rand und gelber Mitte, blaue mit petrolfarbenem Rand und weißer Mitte, pfirsich-rosa mit hellrosa Rand und salbeigrüner Mitte oder gelbe mit rotem Rand und weißer Mitte, jeweils mit grünem Stiel.' },
    ],
    materials: ['Acryl'],
    size: 'Ø 15 cm',
    alts: [
      'Vier gehäkelte Blumen-Untersetzer in Blau, Orange, Rot und Rosa mit Stielen',
      'Orangefarbener gehäkelter Blumen-Untersetzer mit rotem Wellenrand und weißer Mitte',
      'Roter gehäkelter Blumen-Untersetzer mit cremefarbenem Wellenrand und gelber Mitte',
    ],
  },
  'flower-crossbody-phone-bag': {
    name: 'Handytasche aus kleinen Blumen',
    seoTitle: 'Gehäkelte Handytasche aus bunten kleinen Blumen, zum Umhängen',
    body: `<p>Eine Häkeltasche ganz aus kleinen Blumen, klein genug für ein Handy und eine Lippenpflege, farbenfroh genug, um das ganze Outfit zu sein.</p>
<p>Hui häkelt jede Blume einzeln in Rosa, Rot, Orange, Gelb, Grün, Blau, Salbei und Flieder und fügt sie dann zu einer Tasche mit einer Perle an der Öffnung zusammen. Der 120-cm-Gurt lässt sich ein- und aushaken, in Rosa oder Petrol, so kannst du ihn passend zum Outfit wechseln.</p>
<ul>
<li><strong>Aus handgehäkelten Blumen:</strong> acht Farben in einer Tasche, keine gleicht genau der anderen.</li>
<li><strong>Abnehmbarer 120-cm-Gurt:</strong> Rosa oder Petrol, am Karabiner ausgehakt und schnell gewechselt.</li>
<li><strong>Für Handy, Lippenpflege, Schlüssel, Münzen und ein kleines Parfüm:</strong> Kinder tragen darin auch Süßigkeiten und winziges Spielzeug.</li>
<li><strong>Rund 0,07 kg:</strong> die leichteste Tasche im Sortiment.</li>
<li><strong>12 × 18 × 1 cm:</strong> klein genug für jedes Outfit.</li>
</ul>
<p>Eine fröhliche Wahl für Strandtage, Festivals und Märkte, und ein einfaches Geschenk zum Geburtstag oder Jahrestag für alle, die Farbe mögen.</p>
<p><em>B 12 × H 18 × T 1 cm, Gurt 120 cm. Jede Tasche ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Kann ich den Gurt wechseln?', a: 'Ja. Der Karabiner lässt sich lösen, so wechselst du den rosa oder petrolfarbenen Gurt ganz einfach.' },
      { q: 'Was passt hinein?', a: 'Ein Handy, ein paar Lippenpflegestifte, Schlüssel, Münzen, ein kleines Parfüm und ein paar Taschentücher.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser bis 40 °C waschen, flach liegend trocknen und nicht in die direkte Sonne legen.' },
    ],
    option: { name: 'Gurt', values: { 'Style 1 - Pink Strap': 'Modell 1, rosa Gurt', 'Style 2 - Teal Strap': 'Modell 2, petrolfarbener Gurt' } },
    materials: ['Garn aus Polyester und Acryl', 'Metall', 'Kunstperlen'],
    size: 'B 12 × H 18 × T 1 cm, Gurt 120 cm',
    alts: [
      'Bunte gehäkelte Blumen-Umhängetasche mit rosa Gurt, von hinten getragen',
      'Bunte gehäkelte Blumen-Umhängetasche mit petrolfarbenem Gurt, über einem Rock getragen',
      'Bunte gehäkelte Blumen-Umhängetasche in Nahaufnahme mit petrolfarbenem Gurt',
    ],
  },
  'flower-shoulder-bag-with-flower-charm': {
    name: 'Schultertasche mit bauschigen Blütenknospen',
    seoTitle: 'Gehäkelte Schultertasche mit Blütenknospen und Blumenanhänger, groß oder klein',
    body: `<p>Eine Häkeltasche voller Reihen bauschiger Blütenknospen, in zwei Größen, damit du und dein Kind im Partnerlook gehen könnt, ohne dieselbe Tasche zu tragen.</p>
<p>Hui häkelt die Knospen in Reihen mit grünen Blattmaschen dazwischen, schließt den oberen Rand mit einer gewellten Rüsche ab und verschließt die Vorderseite mit einem Perlenknopf. Die große Tasche steht auf goldenen Bodennieten, und ein Blumenanhänger in der Farbe der Knospen wird mit einem kleinen Metallkarabiner an den Gurt gehakt.</p>
<ul>
<li><strong>Zwei Größen:</strong> groß, rund 250 g, oder klein, rund 80 g. Beide mit 120-cm-Gurt.</li>
<li><strong>Drei Farben:</strong> Rosa mit rosa Anhänger, Blau mit weißem Gänseblümchen-Anhänger oder Gelb mit Sonnenblumen-Anhänger.</li>
<li><strong>Zwei Henkel plus abnehmbarer Umhängegurt:</strong> in der Hand oder freihändig tragen.</li>
<li><strong>In die große passen Handy, Geldbörse, Schlüssel, Sonnenbrille und eine Trinkflasche:</strong> in die kleine Handy, Karten und Lippenpflege.</li>
</ul>
<p>Ein süßes Mutter-Kind-Set aus großer und kleiner Tasche zusammen, oder allein ein Geburtstagsgeschenk für Blumenfans.</p>
<p><em>B 23 × H 18 × T 6,5 cm, Gurt 120 cm. Jede Tasche ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Welche Größen gibt es?', a: 'Groß: oben B 29 cm, unten B 23 cm, H 18 cm, T 6,5 cm. Klein: oben B 23 cm, unten B 17,5 cm, H 13 cm, T 2 cm. Beide mit 120-cm-Gurt.' },
      { q: 'Was passt hinein?', a: 'In die große passen Handy, Geldbörse, Schlüssel, Sonnenbrille und eine kleine Trinkflasche. In die kleine Handy, Karten und Lippenpflege.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser bei höchstens 40 °C waschen, flach liegend trocknen und feucht in Form ziehen.' },
    ],
    option: { name: 'Modell', values: { 'Pink Large': 'Rosa, groß', 'Yellow Large': 'Gelb, groß', 'Blue Large': 'Blau, groß', 'Pink Small': 'Rosa, klein', 'Yellow Small': 'Gelb, klein', 'Blue Small': 'Blau, klein' } },
    materials: ['Polyester', 'Kunstperlen'],
    size: 'B 23 × H 18 × T 6,5 cm, Gurt 120 cm',
    alts: [
      'Cremefarbene gehäkelte Blumentasche mit gelben Knospen und Sonnenblumen-Anhänger, quer über dem Körper getragen',
      'Zwei blaue gehäkelte Blumentaschen mit Pastellknospen und Gänseblümchen-Anhänger, groß und klein',
      'Große und kleine cremefarbene gehäkelte Blumentasche mit gelben Knospen und Sonnenblumen-Anhängern',
    ],
  },
  'frog-crossbody-phone-bag': {
    name: 'Frosch-Handytasche mit Klappmaul',
    seoTitle: 'Gehäkelte Frosch-Handytasche mit Klappmaul, zum Umhängen',
    body: `<p>Das Maul dieses Froschs klappt auf wie ein Scharnier, so fällt dein Handy direkt hinein, ohne Kampf mit dem Reißverschluss.</p>
<p>Hui häkelt den Kopf mit vorstehenden weiß-schwarzen Noppenaugen und einem dicken rosa Maulrand und arbeitet dann den Rüschenkragen und einen gesprenkelten, flauschigen Körper aus cremefarbenem und buntem Garn. Das Maul ist die einzige Öffnung: kein Reißverschluss, kein Knopf, kein Druckknopf, einfach hineingreifen.</p>
<ul>
<li><strong>Maul als Klappe:</strong> direkt nach dem Handy greifen, ohne mit einem Verschluss zu fummeln.</li>
<li><strong>110 cm gehäkelter Gurt:</strong> quer über dem Körper oder über einer Schulter.</li>
<li><strong>Gesprenkeltes Bauchgarn:</strong> jede Tasche hat ihre eigene, leicht andere Farbmischung.</li>
<li><strong>Für Handy, Karten, Schlüssel, eine kleine Geldbörse und Lippenpflege:</strong> genug für das Nötigste, nicht mehr.</li>
<li><strong>Rund 110 g:</strong> leicht für eine so hohe Tasche.</li>
</ul>
<p>Ein albernes, einprägsames Geschenk für Froschfans oder alle, die ein Accessoire mit echter Persönlichkeit wollen.</p>
<p><em>Oben B 14 cm, unten B 12 cm, H 26 cm, T 1 cm, Gurt 110 cm. Jeder Frosch ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Wie geht sie auf?', a: 'Das Maul klappt auf. Es gibt keinen Reißverschluss, Knopf oder Druckknopf, du greifst einfach hinein.' },
      { q: 'Was passt hinein?', a: 'Ein Handy, Karten, Schlüssel, eine kleine Geldbörse und Lippenpflege.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser mit mildem Waschmittel waschen, Maul und Augen feucht in Form bringen und flach liegend trocknen. Die Noppenaugen nicht auswringen.' },
    ],
    materials: ['Polyester'],
    size: 'B 12 × H 26 × T 1 cm, Gurt 110 cm',
    alts: [
      'Grüne gehäkelte Froschtasche mit rosa Maul und gesprenkeltem Bauch, quer über dem Körper getragen',
      'Grüne gehäkelte Froschtasche in Nahaufnahme mit vorstehenden Augen und rosa Maul',
      'Grüne gehäkelte Froschtasche quer über dem Körper getragen, von hinten, über grauer Jogginghose',
    ],
  },
  'giraffe-crossbody-bag-for-kids': {
    name: 'Giraffen-Umhängetasche für Kinder',
    seoTitle: 'Gehäkelte Giraffen-Umhängetasche für Kinder von 2 bis 7 Jahren',
    body: `<p>Eine weiche gelbe Giraffe, die Kleinkinder tragen wollen, nicht nur halten, mit einem 3D-Kopf und gerade genug Platz für die Schätze des Tages.</p>
<p>Hui häkelt die Giraffe aus Acrylgarn, setzt den Kopf auf einen langen Hals, ergänzt braune Flecken, Hörner mit braunen Spitzen und kleine Ohren und vollendet das Gesicht mit einer weiß gestickten Schnauze und schwarzen Sicherheitsaugen. Vier kurze Beine mit braunen Hufen baumeln unten.</p>
<ul>
<li><strong>Oben offen, mit Knopfverschluss:</strong> genau richtig für kleine Finger.</li>
<li><strong>Für Süßigkeiten, Münzen, ein kleines Spielzeug, Haarspangen oder einen Müsliriegel:</strong> genug für einen Tag unterwegs, nicht mehr.</li>
<li><strong>85 cm verstellbarer Gurt:</strong> passt den meisten Kindern von etwa 2 bis 7 Jahren.</li>
<li><strong>Rund 130 g:</strong> leicht genug für kleine Schultern.</li>
<li><strong>Orangefarbenes Futter innen:</strong> damit kleine Dinge nicht in den Maschen hängen bleiben.</li>
</ul>
<p>Gemacht für Tage im Park, Zoobesuche und Nachmittage zu Hause, weich genug, um sie auch zu knuddeln. Ein fröhliches Geschenk für Kleinkinder oder jüngere Kinder.</p>
<p><em>Körper B 18 cm, H 12 cm, T 5 cm, Gesamthöhe mit Kopf rund 28 cm, Gurt 85 cm. Von Hand gehäkelt, rechne also mit 2 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Für welches Alter ist sie gemacht?', a: 'Der 85-cm-Gurt passt den meisten Kindern von etwa 2 bis 7 Jahren.' },
      { q: 'Was passt hinein?', a: 'Süßigkeiten, Münzen, ein kleines Spielzeug, Haarspangen oder ein Müsliriegel. Es ist eine Kindertasche, viel mehr passt also nicht hinein.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder warmem Wasser unter 40 °C waschen, Kopf und Beine feucht in Form bringen und flach liegend trocknen.' },
    ],
    materials: ['Acryl'],
    size: 'B 18 × H 28 × T 5 cm, Gurt 85 cm',
    alts: [
      'Mädchen mit gelber gehäkelter Giraffen-Umhängetasche mit braunen Flecken im Garten',
      'Lächelndes Mädchen mit gelber gehäkelter Giraffentasche quer über der Brust',
      'Winkendes Mädchen mit gelber gehäkelter Giraffen-Umhängetasche auf einer Bank',
    ],
  },
  'girl-character-phone-bag': {
    name: 'Mädchentasche mit Vichy-Schleife',
    seoTitle: 'Gehäkelte Mädchen-Handytasche mit Zöpfen und Vichy-Schleife',
    body: `<p>Die meisten Figurentaschen sind für einen echten Tag unterwegs zu klein. Diese hat 15 cm Tiefe, genug Platz für ein Handy, einen Lippenstift und Schlüssel.</p>
<p>Hui häkelt den Kopf mit braunen Locken in geflochtenen Zöpfen, bindet eine rot-weiße Vichy-Schleife, setzt schwarze Sicherheitsaugen und pfirsichfarbene Wangen und arbeitet dann nach unten ein rot gestreiftes Shirt, das in ein gerüschtes blaues Kleid übergeht, mit weißen Armen und rot gestreiften Beinen und Schuhen. Der lächelnde Mund mit pfirsichfarbenem Rand ist der Eingang.</p>
<ul>
<li><strong>Öffnung durch den Mund:</strong> greif durch das lächelnde Gesicht nach deinen Sachen.</li>
<li><strong>Für Smartphones bis 6,7 Zoll:</strong> dazu ein Lippenstift, Handdesinfektion und ein Kartenetui.</li>
<li><strong>15 cm tief:</strong> eine der geräumigeren Taschen im Sortiment.</li>
<li><strong>120 cm verstellbarer roter geflochtener Gurt:</strong> hak deine Schlüssel daran oder steck sie hinein.</li>
<li><strong>Rund 130 g:</strong> geräumig, ohne schwer zu wirken.</li>
</ul>
<p>Der kräftige rote Gurt hebt sich von einem neutralen Mantel ab, und das Design braucht kein Geschenkpapier, um zu beeindrucken.</p>
<p><em>Oben B 13 cm, unten B 15 cm, H 31 cm, T 15 cm, Gurt 120 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Handys bis 6,7 Zoll passen, mit Platz für einen Lippenstift, Handdesinfektion und ein Kartenetui.' },
      { q: 'Wie geräumig ist sie?', a: 'Mit 15 cm Tiefe ist sie eine der geräumigeren Taschen im Sortiment.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser unter 40 °C mit mildem Waschmittel waschen, separat, um das rote Garn zu schonen, und flach liegend trocknen.' },
    ],
    materials: ['Polyester'],
    size: 'B 15 × H 31 × T 15 cm, Gurt 120 cm',
    alts: [
      'Gehäkelte Puppentasche mit lockigen Zöpfen und Vichy-Schleife, in der Hand gehalten',
      'Gehäkelte Puppentasche an einem roten geflochtenen Gurt umgehängt, neben einem Kaffeebecher',
      'Gehäkelte Puppentasche an einem roten Gurt quer über einem schwarzen Kapuzenpulli getragen',
    ],
  },
  'mushroom-crossbody-bag': {
    name: 'Pilztasche mit Kordelzug',
    seoTitle: 'Gehäkelte Fliegenpilz-Umhängetasche mit Kordelzug',
    body: `<p>Eine Pilztasche mit eigenem Kordelzug oben, geräumig genug für ein Handy, ohne ihre Pilzform zu verlieren.</p>
<p>Hui häkelt den Hut in Rot mit weißen Punkten und einer winzigen Blume mit gelber Mitte, schließt ihn mit geflochtenen Kordeln und häkelt darunter den Stiel in Creme.</p>
<ul>
<li><strong>Kordelzug:</strong> die geflochtenen Kordeln mit einem Zug schließen.</li>
<li><strong>Platz für Handy, Schlüssel, Karten und Lippenpflege:</strong> ein weiches Fach, ohne Unterteilungen.</li>
<li><strong>120 cm Gurt:</strong> quer über dem Körper oder über der Schulter.</li>
<li><strong>Rund 170 g:</strong> solide, ohne schwer zu wirken.</li>
<li><strong>Kommt zurück in Form, wenn sie zerdrückt wurde:</strong> nach dem Versand sanft in Form drücken, und sie sieht wieder aus wie vorher.</li>
</ul>
<p>Ein lustiges Geschenk für alle, die Pilzsachen sammeln, oder einfach eine Tasche mit mehr Persönlichkeit als eine schlichte Umhängetasche.</p>
<p><em>Oben B 7 cm, unten B 13 cm, H 16 cm, T 13 cm, Gurt 120 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Schlüssel, Karten und Lippenpflege, in einem weichen Fach.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser mit mildem Waschmittel waschen, feucht in Form ziehen und flach liegend trocknen.' },
      { q: 'Sie kam etwas zerdrückt an, ist das normal?', a: 'Ja. Drück sie sanft mit den Händen in Form, und die Häkelarbeit springt zurück.' },
    ],
    materials: ['Polyester'],
    size: 'B 13 × H 16 × T 13 cm, Gurt 120 cm',
    alts: [
      'Rot-weiße gehäkelte Pilztasche mit gelber Blume, quer über dem Körper getragen',
      'Rote gehäkelte Pilztasche mit Kordelzug, flach in der Hand gehalten',
      'Rote gehäkelte Pilztasche mit weißen Punkten und cremefarbenem Stiel, Nahaufnahme',
    ],
  },
  'mushroom-house-mini-crossbody-bag': {
    name: 'Mini-Tasche Pilzhäuschen',
    seoTitle: 'Gehäkelte Mini-Umhängetasche in Form eines Pilzhäuschens',
    body: `<p>Ein winziges gehäkeltes Pilzhäuschen, das sich am Hut öffnet, gemacht für das Nötigste und für ein Gespräch, wo immer du es trägst.</p>
<p>Hui häkelt den roten Hut mit weißen Punkten, einen cremefarbenen Häuschenkörper, eine braune Tür und ein rundes grün-braunes Fenster und legt um den Boden einen Kranz aus kleinen gelben Blumen und grünen Blättern.</p>
<ul>
<li><strong>Der Hut lässt sich oben öffnen:</strong> so kommen die Sachen hinein und heraus.</li>
<li><strong>Für Lippenstift, ein kleines Parfüm, Schlüssel, Münzen, Kopfhörer oder ein paar Bonbons:</strong> eine echte Mini-Tasche, keine Handytasche.</li>
<li><strong>100 cm Gurt:</strong> gehäkelte Kordel, quer über dem Körper oder über der Schulter.</li>
<li><strong>Rund 70 g:</strong> etwa so groß wie deine Faust und genauso leicht.</li>
</ul>
<p>Eine lustige Ausgehtasche, wenn du nur das Nötigste brauchst, oder ein dekoratives Stück über dem Mantel, das Gespräche anfängt. Ein schönes Geburtstagsgeschenk für alle, die Pilze, Feengärten oder den Cottagecore-Stil mögen.</p>
<p><em>B 11 cm, H 6 cm, T 6 cm, Gurt 100 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Nein. Es ist eine Mini-Tasche für Lippenstift, ein kleines Parfüm, Schlüssel, Münzen, Kopfhörer oder ein paar Bonbons.' },
      { q: 'Wie bekomme ich Sachen hinein und heraus?', a: 'Der Pilzhut lässt sich oben öffnen.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser bei höchstens 40 °C waschen, feucht in Form ziehen und flach liegend trocknen.' },
    ],
    materials: ['Acryl'],
    size: 'B 11 × H 6 × T 6 cm, Gurt 100 cm',
    alts: [
      'Winzige rote gehäkelte Pilzhäuschen-Tasche mit Tür und Fenster, quer über dem Körper getragen',
      'Winzige rote gehäkelte Pilzhäuschen-Tasche an ihrer cremefarbenen Kordel hängend',
      'Nahaufnahme einer winzigen gehäkelten Pilzhäuschen-Tasche mit gestickter Tür und Fenster',
    ],
  },
  'ostrich-crossbody-bag-with-loop-yarn-body': {
    name: 'Strauß-Tasche mit Krone aus Schlingengarn',
    seoTitle: 'Gehäkelte Strauß-Umhängetasche aus zotteligem Schlingengarn, mit Krone',
    body: `<p>Ein zotteliger Strauß aus Schlingengarn mit einer winzigen Krone, geräumig genug für dein Handy und gerade albern genug, dass alle danach fragen.</p>
<p>Hui häkelt den Körper in Schlingenmaschen für eine flauschige, struppige Struktur, setzt einen weißen Kopf mit schwarz gestickten Augen und einer gelben Krone darauf, ergänzt zwei Kunstperlen am Körper und lässt die gelben Beine unten baumeln.</p>
<ul>
<li><strong>Oben offen, direkt hineingreifen:</strong> kein Reißverschluss, kein Druckknopf, kein Kordelzug.</li>
<li><strong>Für ein Handy, Schlüssel, Lippenpflege, eine kleine Dose und Karten:</strong> kein ganzes iPad und keine Zeitschrift.</li>
<li><strong>108 cm fester Gurt:</strong> Umhängelänge für Kinder oder Erwachsene.</li>
<li><strong>Rund 140 g:</strong> leicht für eine Tasche mit so viel Struktur.</li>
<li><strong>Drei Farben:</strong> Braun, Rosa oder Schwarz, jede mit demselben weißen Kopf und gelben Beinen.</li>
</ul>
<p>Passt auf den Markt, zum Spaziergang oder zum Herumflitzen, für alle, die eine Tasche mit Persönlichkeit wollen. Ein schönes Geburtstagsgeschenk für Vogelfans oder alle, die eine etwas alberne Tasche mögen.</p>
<p><em>Öffnung oben 15 cm, unten B 14 cm, H 11 cm, T 14 cm, Gurt 108 cm. Von Hand gehäkelt, rechne also mit 2 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Schlüssel, Lippenpflege, eine kleine Dose und Karten. Ein großes iPad oder eine A4-Zeitschrift passen nicht.' },
      { q: 'Ist der Gurt verstellbar?', a: 'Nein, er ist fest 108 cm lang, gemacht zum Umhängen.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem Wasser mit mildem Waschmittel waschen, feucht in Form ziehen, flach liegend trocknen und vorsichtig mit den Perlen sein.' },
    ],
    option: { name: 'Farbe', values: { Pink: 'Rosa', Black: 'Schwarz', Brown: 'Braun' } },
    materials: ['Polyester', 'Kunstperlen'],
    size: 'B 14 × H 11 × T 14 cm, Gurt 108 cm',
    alts: [
      'Rosa zottelige Strauß-Häkeltasche aus Schlingengarn mit weißem Kopf, quer über dem Körper getragen',
      'Mädchen in hellblauem Outfit mit rosa Strauß-Häkeltasche aus Schlingengarn',
      'Mädchen an einem Cafétisch mit schwarzer Strauß-Häkeltasche aus Schlingengarn, umgehängt',
    ],
  },
  'overalls-character-crossbody-bag-with-pearl-chain-strap': {
    name: 'Latzhosen-Figur-Tasche mit Perlenkette',
    seoTitle: 'Gehäkelte Figur-Umhängetasche in Latzhose, mit Perlenketten-Gurt',
    body: `<p>Eine grinsende Figur in Latzhose mit baumelnden Stiefeln und einem Perlenketten-Gurt, die dein Handy trägt, als wäre es das Leichteste der Welt.</p>
<p>Hui häkelt den cremefarbenen Latzhosen-Körper in einer kräftigen Masche, stickt das lächelnde Gesicht in gelbem und schwarzem Garn von Hand auf den Latz, ergänzt petrolfarbene Träger mit funktionierenden Knöpfen und lässt ein Paar gelbe gehäkelte Stiefel unten frei baumeln.</p>
<ul>
<li><strong>Platz für das Alltägliche:</strong> Handy, Schlüssel, Karten, Lippenpflege und andere Kleinigkeiten.</li>
<li><strong>Funktionierende Trägerknöpfe:</strong> nicht nur zur Zierde, sie lassen sich wirklich schließen.</li>
<li><strong>Gurt aus weißer Perlenkette:</strong> lang genug zum Umhängen oder für eine Schulter.</li>
<li><strong>Rund 110 g:</strong> sehr leicht für ihre Größe.</li>
<li><strong>Baumelnde gelbe Stiefel:</strong> bewegen sich beim Gehen, sie gehören zur Figur.</li>
</ul>
<p>Ein schräges Figurenstück für Teenager und junge Erwachsene, die etwas anderes wollen, und ein liebevolles handgemachtes Geschenk für alle, die ungewöhnliche Taschen sammeln.</p>
<p><em>B 30 cm, H 27 cm, T 2 cm, Gesamthöhe mit Trägern rund 28,5 cm. Von Hand gehäkelt, rechne also mit 2 bis 4 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was passt hinein?', a: 'Ein Handy, Schlüssel, Karten, Lippenpflege und andere Kleinigkeiten für jeden Tag.' },
      { q: 'Funktionieren die Trägerknöpfe wirklich?', a: 'Ja, sie funktionieren, sie sind nicht nur Deko.' },
      { q: 'Wie wasche ich sie?', a: 'Mit einem feuchten Tuch punktuell reinigen oder sanft von Hand in kühlem Wasser waschen, dann feucht in Form ziehen und flach liegend an der Luft trocknen.' },
    ],
    materials: ['Polyester', 'Kunstperlen'],
    size: 'B 30 × H 27 × T 2 cm',
    alts: [
      'Cremefarbene gehäkelte Latzhosen-Figur-Tasche mit petrolfarbenen Trägern und gelben Stiefeln, hochgehalten',
      'Cremefarbene gehäkelte Latzhosen-Tasche mit petrolfarbenen Trägern, an einer Perlenkette umgehängt',
      'Cremefarbene gehäkelte Latzhosen-Tasche mit baumelnden gelben Stiefeln, umgehängt, von hinten',
    ],
  },
  'palm-tree-phone-bag': {
    name: 'Palmen-Handytasche',
    seoTitle: 'Gehäkelte Handytasche mit Palme, Sonne und Wellen, zum Umhängen',
    body: `<p>Eine fröhliche kleine Tasche für Handy, Lippenpflege und Lippenstift, klein genug, um in einer Strandtasche zu verschwinden, und fröhlich genug, um sie vom anderen Ende des Strands zu sehen.</p>
<p>Hui häkelt den Körper in Creme und Gelb gestreift und arbeitet dann Palme, Sonne und Wellen direkt in die Maschen ein, in Kontrastgarn, nicht aufgedruckt. Eine Knopfschlaufe mit Holzknopf schließt die Tasche oben, und drehbare Metallkarabiner lassen dich den Gurt abnehmen und sie als Täschchen allein tragen.</p>
<ul>
<li><strong>Knopfschlaufe mit Holzknopf:</strong> schließt die Tasche oben, ohne Reißverschluss, der hängen bleibt.</li>
<li><strong>Drehbare Metallkarabiner:</strong> den 115-cm-Gurt abnehmen und sie allein als Täschchen tragen.</li>
<li><strong>Platz für das Nötigste:</strong> ein Handy, Lippenpflege und ein Lippenstift passen hinein.</li>
<li><strong>Rund 110 g:</strong> so leicht, dass du sie vergisst.</li>
</ul>
<p>Sie lohnt sich an Strandtagen und im Urlaub, wenn du die Hände frei haben willst. Und sie ist ein einfaches Geschenk zum Geburtstag oder einfach so, für alle, die den Küstenlook mögen.</p>
<p><em>B 13 cm, H 18 cm, T 1 cm, Gurt 115 cm. Von Hand gemessen, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Kann ich den Gurt abnehmen?', a: 'Ja. Mit den drehbaren Metallkarabinern hakst du ihn aus und trägst die Tasche allein als Täschchen.' },
      { q: 'Was passt hinein?', a: 'Ein Handy, Lippenpflege und ein Lippenstift.' },
      { q: 'Wie wasche ich sie?', a: 'Von Hand in kühlem oder lauwarmem Wasser unter 40 °C waschen, flach liegend trocknen und nicht in die pralle Sonne legen.' },
    ],
    materials: ['Metall', 'Polyester', 'Holz'],
    size: 'B 13 × H 18 × T 1 cm, Gurt 115 cm',
    alts: [
      'Gelbe gehäkelte Handytasche mit Palme und Wellen, quer über dem Körper getragen',
      'Gelbe gehäkelte Handytasche mit Palme, Sonne und Wellen, Nahaufnahme',
      'Gelbe gehäkelte Handytasche mit Palme, quer über dem Körper getragen, von hinten',
    ],
  },
  'panda-coin-purse': {
    name: 'Panda-Tasche mit Bügelverschluss',
    seoTitle: 'Gehäkelte Panda-Tasche mit Bügelverschluss und abnehmbarem Gurt',
    body: `<p>Mit einer Hand aufklicken, Münzen hinein, wieder zuklicken. Kein Reißverschluss, nur ein Bügelverschluss, der mit einem Klick schließt.</p>
<p>Hui häkelt zuerst den runden schwarz-weißen Bärenkörper und vollendet dann das Gesicht mit Sicherheitsaugen, einer gestickten Nase und einem kleinen grünen Bambusspross in den Pfoten. Mit einer abnehmbaren 120-cm-Kordel trägst du sie quer über dem Körper oder allein als Täschchen.</p>
<ul>
<li><strong>Für Handys bis 6,7 Zoll:</strong> dazu ein Kartenetui, Lippenpflege und Kopfhörer.</li>
<li><strong>120 cm abnehmbarer Gurt:</strong> mit Karabinern, zum Umhängen oder ohne Gurt.</li>
<li><strong>Flacher Boden:</strong> steht von selbst aufrecht, wenn du sie abstellst.</li>
<li><strong>Rund 190 g:</strong> leicht genug für jeden Tag.</li>
</ul>
<p>Ein fröhliches Alltagstäschchen für Pandafans oder ein lustiges Geschenk für alle, die ihre Accessoires mit ein bisschen Persönlichkeit mögen.</p>
<p><strong>Tipp von Käufern:</strong> Nimm den Gurt ab, dann steht die Tasche aufrecht auf ihrem flachen Boden und funktioniert als Täschchen für sich.</p>
<p><em>Oben B 10 cm, unten B 15 cm, H 20 cm, T 10 cm, Gurt 120 cm. Jede Tasche ist von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Handys bis 6,7 Zoll passen, mit Platz für ein Kartenetui, Lippenpflege und Kopfhörer.' },
      { q: 'Kann ich den Gurt abnehmen?', a: 'Ja, die 120-cm-Kordel lässt sich an den Karabinern abnehmen.' },
      { q: 'Wie wasche ich sie?', a: 'Nur Handwäsche in kühlem Wasser unter 30 °C mit mildem Waschmittel, vorher den Gurt abnehmen, ausdrücken statt auswringen und flach liegend trocknen.' },
    ],
    materials: ['Polyester'],
    size: 'B 15 × H 20 × T 10 cm, Gurt 120 cm',
    alts: [
      'Schwarz-weiße gehäkelte Panda-Tasche mit Bügelverschluss, die Bambus hält',
      'Gehäkelte Panda-Tasche quer über einem grauen Kapuzenpulli getragen',
      'Gehäkelte Panda-Tasche an ihrem schwarzen Gurt umgehängt',
    ],
  },
  'rainbow-crochet-wizard-hat': {
    name: 'Gehäkelter Regenbogen-Zaubererhut für Kinder',
    seoTitle: 'Gehäkelter Regenbogen-Zaubererhut für Kinder von 2 bis 9 Jahren, mit Stern',
    body: `<p>Ein Regenbogenhut mit Spitze und einem Stern obendrauf, auf einem vollen Spielplatz leicht zu entdecken und warm genug für echtes Winterwetter.</p>
<p>Hui häkelt die Verlaufsstreifen senkrecht von der Krempe bis zur Spitze aus dickem, weichem Acrylgarn und setzt oben einen 8 cm großen, von Hand aufgenähten Stern auf. Die gerüschte Krempe lässt sich über kleine Ohren ziehen und hält den Wind ab, und an Verkleidungstagen ist der Hut gleich ein Kostüm.</p>
<ul>
<li><strong>Senkrechte Regenbogenstreifen:</strong> kräftig genug, um dein Kind auf einem vollen Spielplatz zu entdecken.</li>
<li><strong>Dehnbare gerüschte Krempe:</strong> lässt sich über die Ohren ziehen und hält kalten Wind ab.</li>
<li><strong>8 cm Stern:</strong> von Hand an der Spitze aufgenäht.</li>
<li><strong>Zwei Größen:</strong> 2 bis 5 Jahre (48 cm Krempe) oder 5 bis 9 Jahre (58 cm Krempe).</li>
<li><strong>Rund 100 g:</strong> leicht genug, um ihn den ganzen Tag drinnen oder draußen zu tragen.</li>
</ul>
<p>Ein fotogenes Wintergeschenk von Eltern und Großeltern und ein lustiges Verkleidungsstück, lange nachdem die Kälte vorbei ist.</p>
<p><em>2 bis 5 Jahre: 48 cm Krempe. 5 bis 9 Jahre: 58 cm Krempe. Jeder Hut ist von Hand gehäkelt, daher weichen Streifenbreite und Winkel der Spitze leicht ab.</em></p>`,
    faq: [
      { q: 'Welche Größen gibt es?', a: '2 bis 5 Jahre mit 48 cm Krempe oder 5 bis 9 Jahre mit 58 cm Krempe.' },
      { q: 'Kann man ihn als Kostüm tragen?', a: 'Ja, er ist auch ein Verkleidungsstück für fantasievolles Spielen.' },
      { q: 'Wie wasche ich ihn?', a: 'Von Hand oder in der Maschine im kühlen Waschgang bei höchstens 40 °C waschen, getrennt von dunklen Farben, feucht in Form ziehen und flach liegend trocknen.' },
    ],
    option: { name: 'Größe', values: { '2–5 years -48cm brim': '2–5 Jahre, 48 cm Krempe', '5–9 years -58cm brim': '5–9 Jahre, 58 cm Krempe' } },
    materials: ['Acryl'],
    size: '2–5 Jahre Krempe 48 cm / 5–9 Jahre Krempe 58 cm',
    alts: [
      'Kind mit regenbogengestreiftem gehäkeltem Zaubererhut mit Stern, von vorne',
      'Kind im Schulpullover mit gehäkeltem Regenbogen-Zaubererhut, von der Seite',
      'Nahaufnahme eines Kindes mit gehäkeltem Regenbogen-Zaubererhut mit Stern',
    ],
  },
  'sheep-crossbody-bag': {
    name: 'Lockige Lamm-Tasche mit baumelnden Beinen',
    seoTitle: 'Gehäkelte Schaf-Umhängetasche mit Lockenkopf und baumelnden Beinen',
    body: `<p>Eine kleine Lamm-Tasche mit weichem, lockigem Noppenkopf und baumelnden Beinen, gemacht für ein Handy und die Kleinigkeiten, die du wirklich dabeihast.</p>
<p>Hui häkelt den cremefarbenen Körper und einen dunkelbraunen Kopf in einer Noppenmasche für den lockigen, wolligen Look und arbeitet den Körper in einer glatteren Masche, die deine Sachen hält. Dunkelbraune Ohren, ein Schwanz, schwarze Sicherheitsaugen und vier baumelnde Beine vervollständigen die Figur, mit einem dunkelbraunen Kordelgurt zum Umhängen oder für die Schulter.</p>
<ul>
<li><strong>Kopf in Noppenmasche:</strong> gibt dem Lamm seine lockige, wollige Struktur aus weichem Acrylgarn.</li>
<li><strong>Für Handys bis 6,7 Zoll:</strong> dazu ein schmales Kartenetui, gefaltete Scheine, Lippenpflege und Kopfhörer.</li>
<li><strong>Knopfverschluss:</strong> hält das Fach oben geschlossen.</li>
<li><strong>Baumelnde Beine und Schwanz:</strong> machen die 3D-Figur komplett.</li>
<li><strong>Rund 120 g:</strong> leicht für jeden Tag.</li>
</ul>
<p>Eine lustige, kompakte Tasche für Tierfans, Cottagecore-Outfits und Festivaltage, und ein süßes Geschenk für Teenager oder zum Geburtstag.</p>
<p><em>B 18 cm, H 11 cm, T 4 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Passt mein Handy hinein?', a: 'Handys bis 6,7 Zoll passen, mit Platz für ein schmales Kartenetui, gefaltete Scheine, Lippenpflege und Kopfhörer.' },
      { q: 'Wie bleibt der Kopf flauschig?', a: 'Zupf den Noppenkopf nach dem Waschen im feuchten Zustand sanft auf.' },
      { q: 'Wie wasche ich sie?', a: 'Bei Bedarf sanft von Hand in kühlem Wasser unter 30 °C mit milder Seife waschen, ausdrücken statt auswringen und flach liegend trocknen.' },
    ],
    materials: ['Garn aus Polyester und Acryl'],
    size: 'B 18 × H 11 × T 4 cm',
    alts: [
      'Cremefarbene gehäkelte Schaf-Umhängetasche mit flauschigem Kopf und baumelnden Beinen, in der Hand',
      'Cremefarbene gehäkelte Schaf-Umhängetasche mit braunen Ohren, am Gurt hochgehalten',
      'Cremefarbene gehäkelte Schaf-Umhängetasche über der Schulter auf einem cremefarbenen Outfit',
    ],
  },
  'tulip-phone-bag': {
    name: 'Tulpen- oder Sonnenblumen-Handytasche mit Perlenanhänger',
    seoTitle: 'Gehäkelte Handytasche im Tulpen- oder Sonnenblumenmuster, mit Perlenanhänger',
    body: `<p>Eine Handytasche, von Rand zu Rand bedeckt mit winzigen gehäkelten Tulpen oder Sonnenblumen, mit ihrem eigenen Kunstperlen-Anhänger an der Seite.</p>
<p>Hui häkelt das Blumenmuster über den ganzen Körper, Rosa und Grün für die Tulpe oder Gelb, Orange und Grün für die Sonnenblume, beide auf cremefarbenem Grund. Ein Kordelzug mit Holzknopf hält die Tasche oben geschlossen.</p>
<ul>
<li><strong>Blumenmuster rundum:</strong> Tulpen- oder Sonnenblumenmuster über den ganzen Körper gehäkelt, nicht nur als Aufnäher.</li>
<li><strong>Kunstperlen-Anhänger dabei:</strong> eine Perlenkette mit passender gehäkelter Blütenknospe und Blatt.</li>
<li><strong>Kordelzug mit Holzknopf:</strong> schließt die Tasche oben, ohne Reißverschluss.</li>
<li><strong>Handy und Lipgloss passen nebeneinander:</strong> dazu ein Kartenetui oder gefaltete Scheine flach am Handy.</li>
<li><strong>Rund 70 g:</strong> kaum spürbar am 120 cm verstellbaren cremefarbenen geflochtenen Kordelgurt.</li>
</ul>
<p>Eine hübsche Alltagstasche für Cottagecore- und Soft-Girl-Outfits und ein süßes Geschenk für alle, die Blumen lieber in jede Masche gehäkelt als aufgedruckt mögen.</p>
<p><em>B 10,5 cm, H 19 cm, T 1,5 cm, Gurt 120 cm. Von Hand gehäkelt, rechne also mit 1 bis 3 cm Abweichung.</em></p>`,
    faq: [
      { q: 'Was ist dabei?', a: 'Ein Kunstperlen-Anhänger mit passender gehäkelter Blütenknospe und Blatt.' },
      { q: 'Welche Blume kann ich wählen?', a: 'Tulpe (Rosa und Grün) oder Sonnenblume (Gelb, Orange und Grün), beide auf cremefarbenem Grund.' },
      { q: 'Wie wasche ich sie?', a: 'Sanft mit einem feuchten Tuch punktuell reinigen oder, wenn nötig, von Hand in kühlem Wasser mit mildem Waschmittel waschen und flach liegend trocknen.' },
    ],
    option: { name: 'Blume', values: { Tulip: 'Tulpe', Sunflower: 'Sonnenblume' } },
    materials: ['Garn aus Polyester und Acryl'],
    size: 'B 10,5 × H 19 × T 1,5 cm, Gurt 120 cm',
    alts: [
      'Gelbe Handytasche im Sonnenblumenmuster und rosa Handytasche im Tulpenmuster nebeneinander',
      'Gelbe gehäkelte Handytasche im Sonnenblumenmuster mit Perlenkette und Blumenanhänger',
      'Rosa gehäkelte Handytasche im Tulpenmuster mit Perlenkette und Blumenanhänger',
    ],
  },
};
