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
};
