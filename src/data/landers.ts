import type { BundleDef, BundleSize } from '../lib/bundles';

// Copy and photos for the bundle landers at /go/<slug>/. Prices come from
// the lander's own `prices`, else STANDARD_PRICES in src/lib/bundles.ts; shipping, dispatch and returns come from
// the shop's own settings, so a lander can never promise something checkout doesn't.
// Delivery times live on /shipping/ only.
//
// Photo paths are relative to src/assets/. Review keys point at src/data/reviews.json.

export interface Img { src: string; alt: string }
export interface ReviewKey { reviewer: string; date: string }

export interface Lander extends BundleDef {
  /** The shop product this lander sells, for its "full product page" link. None for Finn & the Shamrock. */
  productSlug?: string;
  /**
   * For a product that already has its own bag item (Finn & the Shamrock): that item's
   * slug and the option name for each pack. Without this, the lander gets a generated
   * bundle item. Prices come from BUNDLE_PRICES (src/lib/bundles.ts) either way.
   */
  cart?: { slug: string; options: Record<BundleSize, string> };
  /** Dispatch line, e.g. "Posted within 4 working days". Default: the shop's "Ships in 3–5 days". */
  ships?: string;
  /** Default 30, the shop's policy. */
  returnsDays?: number;
  /** Pieces in one pack unit, when a unit is more than one piece (Fold & Bloom sells pairs of
   * coasters): the boxes then read "Set of 2 / 4 / 6" and price per piece. Default 1. */
  per?: number;
  /** Sizes landers: what the boxes choose between, for "Get both sizes…". Default 'sizes'. */
  sizesWord?: string;
  /** Sizes landers: 'both' (two choices and a set of both, Pearl & Daisy) or 'packs' (three growing
   * packs, Mandala Blooms: nudges up a pack, prices per piece). Default 'both'. */
  sizesKind?: 'both' | 'packs';
  /** Header link back to the shop. Default: ['/shop/bags/', 'All bags']. */
  shop?: [string, string];
  /** Right-hand side of the top bar. Default: "Handmade by Hui". */
  barRight?: string;
  /** Two [heading, text] promises. Default: made to order, and the returns window. */
  promises?: [string, string][];
  title: string;
  description: string;
  og: string;
  bar: string;
  hero: { h1: string; h1em: string; sub: string; image: Img; proof: ReviewKey };
  story: { h: string; paras: string[]; subH: string; subParas: string[] };
  fits: { h: string; lede: string; specs: [string, string][]; image: Img };
  colours?: { h: string; lede: string; cards: { pick: string; title: string; text: string; image: Img }[]; note: string };
  uses: { h: string; items: [string, string][]; images?: Img[] };
  craft: { h: string; paras: string[]; image: Img };
  offer: { h: string; lede: string; notes: Record<BundleSize, string>; flag2: string; /** Starting colour for pieces 1, 2 and 3. */
    defaults: [string, string, string]; proof: ReviewKey };
  reviews: ReviewKey[];
  faq: { q: string; a: string }[];
}

const washFaq = {
  q: 'How do I wash it?',
  a: 'Hand wash in cool or lukewarm water, 40°C at most. Lay it flat to dry, and keep it out of strong sun for long periods.',
};
const arriveFaq = (noun: string) => ({
  q: 'When will it arrive?',
  a: `Hui makes your ${noun} to order, and it ships within 3–5 days with tracking. Delivery times for each country are on the <a href="/shipping/">shipping page</a>. There’s nothing extra to pay on delivery in the EU, UK or US.`,
});
const returnsFaq = {
  q: "What if I don't like it?",
  a: 'Send it back within 30 days of delivery and we refund it, shipping included. Just email us first. <a href="/shipping/">How returns work</a>.',
};
const kidsFaq = (noun: string) => ({
  q: 'Is it for adults or kids?',
  a: `Both. Adults wear the ${noun} as a fun crossbody, and kids keep coins, small toys and sweets in it. It’s a bag rather than a toy, so not for under-3s.`,
});
const mouthFaq = {
  q: 'Does the mouth close?',
  a: 'No. There is no zip, clasp or magnet, so you reach straight in. On a crowded train, wear it across your front.',
};

const friend: ReviewKey = { reviewer: 'wendyjamesstudio', date: '2026-08-22' };
const sturdy: ReviewKey = { reviewer: 'hexfeather', date: '2026-09-25' };
const secondBuy: ReviewKey = { reviewer: 'Antje-Susan', date: '2026-06-02' };
const maria: ReviewKey = { reviewer: 'Maria', date: '2026-02-09' };
const asPictured: ReviewKey = { reviewer: 'Kasie', date: '2026-02-15' };

export const LANDERS: Lander[] = [
  {
    // Moved from finn.sunniedesigns.com (2026-11-12). Same bag item and 60-day returns;
    // prices from the shared price lists in src/lib/bundles.ts.
    slug: 'finn-the-shamrock',
    productSlug: 'finn-the-shamrock-frog-bag',
    name: 'Finn & the Shamrock frog bag',
    noun: ['frog', 'frogs'],
    picks: ['Green'],
    maker: 'Sunnie Designs',
    cart: {
      slug: 'finn-the-shamrock',
      options: { 1: '1 frog', 2: '2 frogs', 3: '3 frogs' },
    },
    ships: 'Posted within 4 working days',
    returnsDays: 60,
    barRight: 'Posted within 4 working days',
    promises: [
      ['He looks like these photos', 'If the stitching, colour or size of your frog doesn’t match the photos on this page, we replace it or refund you in full. We pay the return postage.'],
      ['Posted within 4 working days', 'Your frog leaves us within four working days of your order, all year. If we miss that, we refund your postage.'],
    ],
    title: 'Hand-Crocheted Frog Bag with Shamrock | Finn & the Shamrock',
    description: 'Finn is a hand-crocheted frog crossbody bag that carries your phone hands-free. 39 cm tall, two straps included, sewn-on shamrock, posted within 4 working days, 60-day returns.',
    og: '/go/finn-the-shamrock-og.jpg',
    bar: 'Free shipping on 2 frogs or more',
    hero: {
      h1: 'A hand-crocheted frog that carries',
      h1em: 'your phone, hands-free.',
      sub: 'Drop your phone in his mouth and go. Your hands stay free, and your phone stays where you can reach it. Finn is 39 cm of hand-crocheted frog in dungarees, with a sewn-on shamrock and two straps in the box.',
      image: { src: 'landers/finn-the-shamrock/finn-the-shamrock-finn-frog-bag-phone-closeup-1400.webp', alt: 'A hand dropping a phone in a cream case into the yellow mouth of Finn, a green crocheted frog bag in dungarees' },
      proof: { reviewer: 'hexfeather', date: '2026-09-25' },
    },
    story: {
      h: 'Your phone got bigger. Your pockets didn’t.',
      paras: [
        'Count how many times you patted your pockets today to find your phone.',
        'Phones grew. Jeans pockets stayed the same. A handbag is too much for a walk to the shop, and a phone in your hand ends up on a café table, a car roof or a park bench.',
        'Finn does one small job well. He hangs across your body. His mouth stays open. Your phone sits upright inside him, and you reach in without looking. Your hands stay free for the dog lead, the coffee, the buggy or the small person pulling at your sleeve.',
      ],
      subH: 'Why a mouth and not a zip?',
      subParas: [
        'A zip needs two hands. A clasp makes you look down. Finn’s mouth is a ring of yellow crochet that keeps the opening ready, so your phone drops in with one hand and comes out with one hand.',
        'Expect a few questions at the bus stop, too. A frog in dungarees with a shamrock on his chest gets noticed.',
      ],
    },
    fits: {
      h: 'Your phone, always in reach.',
      lede: 'The yellow mouth is the opening. Slide your phone in from the top and it stands upright inside his body, where you can reach it with one hand. One buyer carries her phone and a 6-inch Kindle in him.',
      specs: [
        ['Size', '39 cm tall, 14 cm wide at the top, 15 cm at the bottom, 1 cm thick. Measured by hand, so allow 1 to 2 cm.'],
        ['Holds', 'Your phone, as in the photos, plus keys and a card'],
        ['Opening', 'Open mouth, no zip or clasp'],
        ['Straps', 'Two in the box: a green crocheted strap, and a 120 cm strap, adjustable and detachable, with gold-tone clasps'],
        ['Made from', 'Soft polyester yarn, wooden buttons, faux pearl'],
        ['Care', 'Hand wash up to 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'landers/finn-the-shamrock/finn-the-shamrock-finn-frog-bag-held-front-900.webp', alt: 'Finn the frog bag held out in front, a phone tucked in his yellow mouth, showing his dungarees, shamrock and long legs' },
    },
    uses: {
      h: 'Where Finn goes',
      items: [
        ['Dog walks.', 'Phone in the frog, lead in one hand, coffee in the other.'],
        ['Gigs and festivals.', 'He sits on your front in a crowd, where you can see him.'],
        ['The school run.', 'Your phone on your front, not lost under a car seat.'],
        ['Travel days.', 'Boarding pass on your phone, phone in the frog, passport in your hand.'],
        ['St Patrick’s Day.', 'He has the shamrock already. You bring the rest.'],
        ['A gift for someone far from Ireland.', 'A small, green, hand-made piece of home.'],
      ],
    },
    craft: {
      h: 'Four hours, one hook, one maker.',
      paras: [
        'No machine makes Finn. One maker spends about four hours on each frog, stitch by stitch, with one hook.',
        'The maker crochets his body and his yellow mouth first. Then his dungarees, with cream edging along every seam. The shamrock is a separate piece, sewn to his chest with a faux pearl at the centre. Two wooden buttons hold his straps. Look close and they read “Handmade with love”.',
        'Because a person makes him, no two frogs match exactly. The stitch tension and the angle of the shamrock change a little from one to the next. Yours is his own frog.',
      ],
      image: { src: 'landers/finn-the-shamrock/finn-the-shamrock-finn-frog-bag-worn-crossbody-900.webp', alt: 'Finn the frog bag worn across the body on a green crocheted strap, with long dangling arms and legs and a shamrock on his dungarees' },
    },
    offer: {
      h: 'Pick your frogs',
      lede: 'We suggest two: one to keep, and one for the friend who will ask where you got yours. Two or more ship free, and each frog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'One to keep, one to give.', 3: 'Three gifts sorted in one order.' },
      defaults: ['Green', 'Green', 'Green'],
      proof: { reviewer: 'Nikki', date: '2026-01-16' },
    },
    reviews: [
      { reviewer: 'Daniel', date: '2026-01-20' },
      { reviewer: 'A happy buyer', date: '2026-01-01' },
      { reviewer: 'Hannah', date: '2026-06-04' },
      { reviewer: 'Elijha', date: '2025-12-20' },
      { reviewer: 'Scott', date: '2025-12-19' },
      { reviewer: 'Nelly', date: '2026-04-17' },
    ],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. The photos show a large phone in a thick case going in through his mouth, and one buyer carries her phone and a 6-inch Kindle. A tablet, laptop or water bottle won’t fit.' },
      { q: 'Is he a bag or a toy?', a: 'A bag, made for teens and adults, with two straps and gold-tone metal clasps. He’s not for under-3s: the buttons and the faux pearl are small parts.' },
      { q: 'Which strap should I use?', a: 'He comes with both. The green crocheted strap matches his body. The 120 cm strap adjusts, so you can wear him on your hip or across your front. Unclip either one to carry him by hand.' },
      { q: 'Does the mouth close?', a: 'No. It has no zip, clasp or magnet, so you reach straight in from the top. On a crowded train, wear him across your front.' },
      { q: 'How do I wash him?', a: 'Hand wash in cool or warm water, up to 40°C. Lay him flat to dry, and keep him out of strong sun for long periods.' },
      { q: 'When will it arrive?', a: 'We post within four working days, and refund your postage if we miss that. Delivery times for each country are on the <a href="/shipping/">shipping page</a>. There’s nothing extra to pay on delivery in the EU, UK or US.' },
      { q: 'What if I don’t like him?', a: 'Send him back within 60 days, worn or not, for a full refund. If you tell us why, the next batch gets better.' },
    ],
  },
  {
    slug: 'finn-in-the-hood',
    productSlug: 'frog-crossbody-purse',
    name: 'Finn in the Hood frog bag',
    noun: ['frog', 'frogs'],
    picks: ['Yellow', 'Blue'],
    maker: 'Hui',
    title: 'Finn in the Hood | Hand-Crocheted Frog Crossbody Bag | Sunnie Designs',
    description: 'A hand-crocheted frog in a hoodie that carries your phone in his big red mouth. Yellow or blue, mix them in a bundle. Free shipping on 2 or more.',
    og: '/go/finn-in-the-hood-og.jpg',
    bar: 'Free shipping on 2 frogs or more',
    hero: {
      h1: 'A frog in a hoodie.',
      h1em: 'His mouth is the bag.',
      sub: 'Your phone, keys and lip balm go in his big red mouth. No zip, no clasp, no rummaging. Finn is 27 cm of hand-crocheted frog in a pointed hood and a little vest, with long legs that swing as you walk.',
      image: { src: 'landers/finn-in-the-hood/finn-in-the-hood-duo.jpg', alt: 'Two crocheted frog bags side by side on a shelf: one in a yellow hood and orange vest, one in a blue hood and vest, both with red mouths and long dangling legs' },
      proof: { reviewer: 'Nicola', date: '2026-07-22' },
    },
    story: {
      h: 'The bag people stop you to ask about.',
      paras: [
        'Most small bags are a plain pouch with a zip. You unzip it, you rummage, you zip it again.',
        'Finn opens the other way. His wide red mouth is the way in, so you reach straight inside and your things are right there. His hood sits up behind his head, his vest has a patch pocket and two red buttons, and his legs dangle past your hip.',
        'He weighs about 170 g, so you forget he’s on until someone asks where you got him. Someone will.',
      ],
      subH: 'Why a mouth and not a zip?',
      subParas: ['A zip needs two hands, and a clasp makes you look down. Finn’s mouth is held open by a thick crocheted rim, so one hand goes in and comes out with your keys.'],
    },
    fits: {
      h: 'Your phone fits. So do your keys.',
      lede: 'Pretty much any phone slides into his mouth. Even a 6-inch Kindle fits once it’s out of its case. Keys, lip balm and a bus card go in beside it.',
      specs: [
        ['Size', '27 cm from hood to toes, legs included. 14 cm wide at the top, 12 cm at the base, 1 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'Your phone, plus keys, lip balm and a bus card'],
        ['Opening', 'His open mouth, with a thick red rim. No zip or clasp.'],
        ['Strap', '120 cm, worn crossbody or over one shoulder'],
        ['Weight', 'About 170 g empty'],
        ['Made from', 'Polyester yarn, with red buttons on his vest'],
        ['Care', 'Hand wash up to 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'landers/finn-in-the-hood/finn-in-the-hood-opening.webp', alt: 'Fingers holding Finn’s thick red mouth rim open to show the green crochet inside' },
    },
    colours: {
      h: 'Pick his hoodie',
      lede: 'Same frog, two outfits. Both have a green body, a cream belly and a thick red mouth.',
      cards: [
        { pick: 'Yellow', title: 'Sunny yellow', text: 'Pointed yellow hood, orange vest with yellow sleeves and a yellow pocket. Bright enough to find in any crowd.', image: { src: 'landers/finn-in-the-hood/finn-in-the-hood-frog-sunny.webp', alt: 'Finn in yellow: a green crocheted frog in a pointed yellow hood and an orange vest with yellow sleeves' } },
        { pick: 'Blue', title: 'Blue and cream', text: 'Blue hood and vest, with cream sleeves and a cream pocket. The calmer one, and easy with jeans.', image: { src: 'landers/finn-in-the-hood/finn-in-the-hood-frog-blue.jpg', alt: 'Finn in blue: a green crocheted frog in a blue hood and vest with cream sleeves and pocket' } },
      ],
      note: 'Can’t choose? Take two and get one of each.',
    },
    uses: {
      h: 'Where Finn goes',
      items: [
        ['Coffee runs.', 'Phone and keys in his mouth, coffee in your hand.'],
        ['Gigs and festivals.', 'He sits on your front, where you can keep an eye on him.'],
        ['A day in town.', 'Phone, lip balm and a bus card, without carrying a handbag.'],
        ['Pocket money.', 'Kids keep coins, sweets and tiny toys in him.'],
        ['The frog person in your family.', 'Every family has one. Now they have the bag.'],
      ],
      images: [
        { src: 'landers/finn-in-the-hood/finn-in-the-hood-life-1.webp', alt: 'Blue Finn worn crossbody over a black knit jumper' },
        { src: 'landers/finn-in-the-hood/finn-in-the-hood-life-3.webp', alt: 'Yellow Finn worn over a navy hoodie' },
        { src: 'landers/finn-in-the-hood/finn-in-the-hood-gift.webp', alt: 'Yellow Finn hanging by his strap from a cream door handle' },
      ],
    },
    craft: {
      h: 'One hook, one maker, one frog at a time.',
      paras: [
        'Hui crochets every Finn by hand, stitch by stitch: the green body and cream belly, the hood, the little vest with its patch pocket and red buttons, and the long legs that hang loose.',
        'Because a person makes him, no two frogs come out exactly alike. The hood sits at its own angle and the stitches vary a little. That’s how you know he wasn’t printed in a factory.',
      ],
      image: { src: 'landers/finn-in-the-hood/finn-in-the-hood-craft.webp', alt: 'Close-up of the orange vest on yellow Finn, with its yellow patch pocket, red buttons and the red mouth rim above' },
    },
    offer: {
      h: 'Pick your frogs',
      lede: 'We suggest two: one to keep, and one for the friend who will ask where you got yours. Two or more ship free, and each frog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'One of each, or a matching pair.', 3: 'Three gifts sorted in one order.' },
      defaults: ['Yellow', 'Blue', 'Yellow'],
      proof: friend,
    },
    reviews: [{ reviewer: 'A happy buyer', date: '2026-01-01' }, { reviewer: 'Nikki', date: '2026-01-16' }, { reviewer: 'Nicola', date: '2026-07-22' }, maria],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. Pretty much any phone fits, and so does a 6-inch Kindle without its case. Keys, lip balm and a bus card go in beside it.' },
      mouthFaq,
      kidsFaq('frog'),
      washFaq,
      arriveFaq('frog'),
      returnsFaq,
    ],
  },
  {
    slug: 'miso-cat',
    productSlug: 'cat-crossbody-bag-with-dangling-legs',
    name: 'Miso the cat bag',
    noun: ['cat', 'cats'],
    picks: ['Black Cat', 'Brown Cat', 'Yellow Cat'],
    maker: 'Hui',
    title: 'Miso | Hand-Crocheted Cat Crossbody Bag | Sunnie Designs',
    description: 'Miso is a hand-crocheted cat in a little sweater, with a wide mouth for your keys and lip balm. Black, brown or yellow. Free shipping on 2 or more, 30-day returns.',
    og: '/go/miso-cat-og.jpg',
    bar: 'Free shipping on 2 cats or more',
    hero: {
      h1: 'A cat in a sweater',
      h1em: 'that carries your keys.',
      sub: 'Miso is a hand-crocheted cat bag with big round eyes, a wide-open mouth and long legs that dangle as you walk. Keys, lip balm and earbuds go in his mouth. Pick black, brown or yellow, each in his own sweater.',
      image: { src: 'products/cat-crossbody-bag-with-dangling-legs/cat-crossbody-bag-with-dangling-legs-01.webp', alt: 'Three crochet cat bags on a wooden shelf: black in a pink sweater, yellow in a blue sweater and brown in a striped sweater' },
      proof: sturdy,
    },
    story: {
      h: 'For the cat person who has every cat mug.',
      paras: [
        'You already own the mug, the socks and the tote with a cat printed on it. Miso is different. He isn’t a picture of a cat. He’s 30 cm of crocheted cat, with a face that looks like he’s about to say something.',
        'He hangs across your body with his legs swinging. His wide mouth is the opening, so your keys and lip balm are one reach away. His sweater does the talking.',
      ],
      subH: 'Small on purpose',
      subParas: ['Miso holds the little things that get lost at the bottom of a big bag. He weighs about 170 g, so he goes everywhere you do.'],
    },
    fits: {
      h: 'What fits in Miso',
      lede: 'His mouth opens wide and the bag is the whole of his body, so small things drop straight in: keys, lip balm, tissues, earbuds, a compact or a bus card.',
      specs: [
        ['Size', '30 cm tall including his dangling legs, 14 cm wide, 1 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Opening', 'His wide mouth. No zip or clasp.'],
        ['Strap', '120 cm, matched to his colour, with metal clasps'],
        ['Weight', 'About 170 g'],
        ['Made from', 'Polyester yarn'],
        ['Care', 'Hand wash up to 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'products/cat-crossbody-bag-with-dangling-legs/cat-crossbody-bag-with-dangling-legs-08.webp', alt: 'Brown Miso open, with his wide orange mouth holding earbuds and a compact' },
    },
    colours: {
      h: 'Three cats, three sweaters',
      lede: 'Every Miso has the same cheeky face. The sweater is what makes him yours.',
      cards: [
        { pick: 'Black Cat', title: 'Black in pink', text: 'Pink sweater with a little blue fish, and an orange mouth. Sharp against a camel coat.', image: { src: 'landers/miso-cat/miso-cat-cat-black.webp', alt: 'Black Miso in a pink sweater with a blue fish' } },
        { pick: 'Brown Cat', title: 'Brown in stripes', text: 'Cream and tan striped sweater with a tiny yellow face on the chest, and an orange mouth. Cosy with knitwear.', image: { src: 'landers/miso-cat/miso-cat-cat-brown.webp', alt: 'Brown Miso in a cream and tan striped sweater with a tiny yellow face' } },
        { pick: 'Yellow Cat', title: 'Yellow in blue', text: 'Blue sweater with a small pink fish, and a pink mouth. The sunny one.', image: { src: 'landers/miso-cat/miso-cat-cat-yellow.webp', alt: 'Yellow Miso in a blue sweater with a pink fish' } },
      ],
      note: 'Can’t pick? Take three and get one of each.',
    },
    uses: {
      h: 'Where Miso goes',
      items: [
        ['Coffee and a walk.', 'Keys and card in his mouth, hands free for the cup.'],
        ['Over a winter coat.', 'He hangs on the outside of your coat, so your keys never end up buried under it.'],
        ['The cat-sitter’s thank-you.', 'A better present than another box of chocolates.'],
        ['Pocket money.', 'Kids keep coins, sweets and small toys in him.'],
        ['Birthdays for cat people.', 'You already know exactly who.'],
      ],
      images: [
        { src: 'landers/miso-cat/miso-cat-life-4.webp', alt: 'Black Miso worn crossbody over a long beige trench coat' },
        { src: 'landers/miso-cat/miso-cat-life-2.webp', alt: 'Brown Miso worn over an oatmeal jumper' },
        { src: 'landers/miso-cat/miso-cat-life-6.webp', alt: 'Yellow Miso worn on a striped shirt' },
      ],
    },
    craft: {
      h: 'Hui makes your cat by hand.',
      paras: [
        'There is no factory and no mould. Hui crochets each Miso stitch by stitch: his face and big round eyes, the sweater with its fish or stripes, and the long arms and legs that hang loose.',
        'Because a person makes him, no two cats are exactly alike. The eyes sit at slightly different angles, and each one looks cheeky in his own way.',
      ],
      image: { src: 'landers/miso-cat/miso-cat-craft.webp', alt: 'A hand holding the finished brown Miso, showing his striped sweater and strap' },
    },
    offer: {
      h: 'Pick your cats',
      lede: 'We suggest two: one to keep, and one for the cat person in your life. Two or more ship free, and each cat costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two sweaters.', 3: 'One of each sweater, or any three.' },
      defaults: ['Black Cat', 'Brown Cat', 'Yellow Cat'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, maria, asPictured],
    faq: [
      { q: 'What fits inside?', a: 'Keys, lip balm, tissues, earbuds, a compact or a bus card. Want a bag for your phone? Meet <a href="/go/snout-and-about/">Snout &amp; About</a>.' },
      mouthFaq,
      kidsFaq('cat'),
      washFaq,
      arriveFaq('cat'),
      returnsFaq,
    ],
  },
  {
    slug: 'snout-and-about',
    productSlug: 'plush-dog-crossbody-phone-bag',
    name: 'Snout & About dog phone bag',
    noun: ['dog', 'dogs'],
    picks: ['Grey Schnauzer', 'Beige Puppy', 'White Terrier'],
    maker: 'Hui',
    title: 'Snout & About | Plush Crochet Dog Phone Bag | Sunnie Designs',
    description: 'A soft, hand-crocheted dog that carries your phone: grey schnauzer, beige puppy or white terrier. Free shipping on 2 or more, 30-day returns.',
    og: '/go/snout-and-about-og.jpg',
    bar: 'Free shipping on 2 dogs or more',
    hero: {
      h1: 'A soft little dog',
      h1em: 'that carries your phone.',
      sub: 'Your phone goes in, his puffy nose points out, and your hands stay free. Hand-crocheted in fluffy plush yarn as a grey schnauzer, a beige puppy or a white terrier, on a brown adjustable strap.',
      image: { src: 'landers/snout-and-about/snout-and-about-trio.webp', alt: 'Three plush crochet dog bags on a wooden shelf: a grey schnauzer, a beige puppy and a white terrier' },
      proof: { reviewer: 'Jacqueline', date: '2026-05-31' },
    },
    story: {
      h: 'The dog you can take everywhere.',
      paras: [
        'Not every café lets the dog in. This one comes along anyway.',
        'Snout & About is a phone bag shaped like a small dog: soft, a bit squishy, with a puffy 3D nose and button eyes. He hangs across your body on a brown strap, keeps your phone and keys together, and gets more hellos than you do.',
      ],
      subH: 'Soft enough to squeeze',
      subParas: ['Hui crochets him in fluffy plush-style yarn, so he feels more like a soft toy than a bag. He weighs about 110 g, so you’ll forget he’s on.'],
    },
    fits: {
      h: 'Your phone, always in reach',
      lede: 'He is made for a phone, with room beside it for keys, lip balm or a bus card. The strap adjusts, so he can sit high on your chest or down at your hip.',
      specs: [
        ['Size', '22 cm tall, 12 cm wide at the top, 13 cm at the bottom, 2 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'A phone, plus keys, lip balm or a bus card'],
        ['Strap', '120 cm brown PU, adjustable: crossbody, on the shoulder or in the hand'],
        ['Weight', 'About 110 g'],
        ['Made from', 'Polyester plush yarn, PU strap'],
        ['Care', 'Hand wash up to 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'landers/snout-and-about/snout-and-about-inside.webp', alt: 'The beige puppy bag on a grey coat with a phone and its brown strap' },
    },
    colours: {
      h: 'A schnauzer, a puppy or a terrier',
      lede: 'Three dogs, all the same price. Mix them however you like.',
      cards: [
        { pick: 'Grey Schnauzer', title: 'Grey schnauzer', text: 'Grey with cream eyebrows and a white muzzle. Looks serious, isn’t.', image: { src: 'landers/snout-and-about/snout-and-about-dog-grey.webp', alt: 'Grey schnauzer bag with cream eyebrows and a puffy black nose' } },
        { pick: 'Beige Puppy', title: 'Beige puppy', text: 'Golden beige with long floppy ears. The one everybody wants to pat.', image: { src: 'landers/snout-and-about/snout-and-about-dog-beige.webp', alt: 'Beige puppy bag with long floppy ears' } },
        { pick: 'White Terrier', title: 'White terrier', text: 'Fluffy white with pink ears and a big black nose. Bright against a dark coat.', image: { src: 'landers/snout-and-about/snout-and-about-dog-white.webp', alt: 'White terrier bag with pink ears and a black nose' } },
      ],
      note: 'Can’t pick? Take three and get one of each.',
    },
    uses: {
      h: 'Where he goes',
      items: [
        ['Dog walks.', 'Phone in the dog, lead in your hand.'],
        ['Coffee runs.', 'Phone and card together, no handbag needed.'],
        ['Days out.', 'Map on your phone, phone on your front.'],
        ['Pocket money.', 'Kids keep coins, snacks and small toys in him.'],
        ['A gift for a dog lover.', 'Especially one whose own dog looks just like him.'],
      ],
      images: [
        { src: 'landers/snout-and-about/snout-and-about-life-1.webp', alt: 'Beige puppy bag worn crossbody over a cream cable-knit jumper' },
        { src: 'landers/snout-and-about/snout-and-about-life-4.webp', alt: 'White terrier bag worn crossbody over a brown jumper' },
        { src: 'landers/snout-and-about/snout-and-about-life-2.webp', alt: 'Grey schnauzer bag worn over a long beige coat' },
      ],
    },
    craft: {
      h: 'Made by hand, one dog at a time.',
      paras: [
        'Hui crochets every dog by hand in plush yarn, then gives him his puffy nose and eyes. The schnauzer gets his cream eyebrows, the puppy his floppy ears.',
        'Because a person makes him, no two dogs come out quite the same. The fluff falls its own way, and every face has its own expression.',
      ],
      image: { src: 'landers/snout-and-about/snout-and-about-detail.webp', alt: 'Close-up of the soft plush yarn and the knotted brown strap' },
    },
    offer: {
      h: 'Pick your dogs',
      lede: 'We suggest two: one for you, and one for the dog lover who will ask where you got yours. Two or more ship free, and each dog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two dogs.', 3: 'One of each, or any three.' },
      defaults: ['Grey Schnauzer', 'Beige Puppy', 'White Terrier'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, maria, asPictured],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. He’s made for a phone, with room beside it for keys and lip balm.' },
      { q: 'Which strap does it come with?', a: 'A 120 cm brown PU strap. It adjusts, so you can wear him crossbody, on the shoulder or carry him in your hand.' },
      kidsFaq('dog'),
      washFaq,
      arriveFaq('dog'),
      returnsFaq,
    ],
  },
  {
    slug: 'party-animals',
    productSlug: 'plush-crossbody-bag-puppy-bear-cat',
    name: 'The Party Animals plush bag',
    noun: ['bag', 'bags'],
    picks: ['White Puppy', 'Yellow Bear', 'Brown Cat'],
    maker: 'Hui',
    title: 'The Party Animals | Plush Crochet Puppy, Bear or Cat Bag | Sunnie Designs',
    description: 'Soft plush crochet bags dressed for a party: a puppy with cake, a bear with cookies, a cat in a bow. Your phone fits. Free shipping on 2 or more.',
    og: '/go/party-animals-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'Dressed for a party,',
      h1em: 'made to carry your phone.',
      sub: 'The Party Animals are soft plush crochet bags: a puppy in a party hat with a strawberry cake, a bear with a plate of cookies, and a cat in her best polka-dot bow. Your phone, keys and lip balm go inside.',
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-01.jpg', alt: 'Three fluffy crochet bags on a wooden shelf: a white puppy, a yellow bear and a brown cat' },
      proof: { reviewer: 'Jacqueline', date: '2026-05-31' },
    },
    story: {
      h: 'A bag that’s always on its way to a party.',
      paras: [
        'Most bags carry things. These ones cheer people up as well.',
        'Each Party Animal is a soft square of fluffy crochet with a face: a white puppy with long black ears, a buttery yellow bear, or a brown cat. The puppy and the bear wear little party hats and bring a treat. People will want to pat it.',
      ],
      subH: 'Soft from every angle',
      subParas: ['Hui crochets them in plush yarn, so they feel more like a soft toy than a handbag. Each one weighs about 150 g, easy to wear all day.'],
    },
    fits: {
      h: 'Your phone fits, with room to spare.',
      lede: 'They’re roomier than they look: 19 cm across and 3 cm deep. A phone, a wallet and a compact all go in together.',
      specs: [
        ['Size', '16 cm tall, 17 cm wide at the top, 19 cm at the bottom, 3 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'A phone, a wallet, keys and lip balm'],
        ['Strap', '120 cm brown PU leather, adjustable: crossbody, on the shoulder or in the hand'],
        ['Weight', 'About 150 g'],
        ['Made from', 'Polyester plush yarn, PU leather strap'],
        ['Care', 'Hand wash up to 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-13.jpg', alt: 'The puppy bag open, holding a phone, a wallet and a compact' },
    },
    colours: {
      h: 'Meet the guests',
      lede: 'Same size, same price. Pick a favourite, or bring the whole party.',
      cards: [
        { pick: 'White Puppy', title: 'The puppy', text: 'White plush, long black floppy ears, a blue party hat and a tiny strawberry cake.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-02.jpg', alt: 'White puppy bag with black floppy ears, a blue party hat and a strawberry cake' } },
        { pick: 'Yellow Bear', title: 'The bear', text: 'Buttery yellow, with a striped party hat and a little plate of chocolate cookies.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-06.jpg', alt: 'Yellow bear bag in a striped party hat, holding a plate of cookies, worn over a black jumper' } },
        { pick: 'Brown Cat', title: 'The cat', text: 'Soft brown plush, whiskers, and a brown-and-white polka-dot bow.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-09.jpg', alt: 'Brown cat bag with a polka-dot bow, held up by its strap' } },
      ],
      note: 'Can’t pick? Three bags, one of each, is the whole party.',
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Coffee with friends.', 'Phone, card and keys, and something to talk about.'],
        ['Days out.', 'Phone on your front, hands free.'],
        ['Birthdays.', 'A present that already looks like a party.'],
        ['A first “big kid” bag.', 'Coins, small toys and sweets have a home.'],
        ['Teens.', 'A bag that stands out at school, in a good way.'],
      ],
      images: [
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-03.jpg', alt: 'Puppy bag worn crossbody over a beige sweatshirt' },
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-08.jpg', alt: 'Bear bag worn over a black jumper' },
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-11.jpg', alt: 'Cat bag worn crossbody over a cream jumper' },
      ],
    },
    craft: {
      h: 'Fluffy, and made by hand.',
      paras: [
        'Hui crochets each Party Animal by hand in plush yarn, then adds the face, the ears and the little extras: the puppy’s cake, the bear’s cookies, the cat’s bow.',
        'Because a person makes them, no two come out quite the same. The fluff falls its own way, and every face has its own expression.',
      ],
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/plush-crossbody-bag-puppy-bear-cat-12.jpg', alt: 'The cat bag worn at the side, showing its whiskers and bow' },
    },
    offer: {
      h: 'Pick your party',
      lede: 'We suggest two: one to keep, and one for the friend whose birthday is coming up. Two or more ship free, and each bag costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two guests.', 3: 'The whole party, or any three.' },
      defaults: ['White Puppy', 'Yellow Bear', 'Brown Cat'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, maria, asPictured],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. A phone goes in with room for a wallet and keys beside it.' },
      { q: 'Which strap does it come with?', a: 'A 120 cm brown PU leather strap. It adjusts, so you can wear it crossbody, on the shoulder or carry it in your hand.' },
      kidsFaq('bag'),
      washFaq,
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'googly-gang',
    productSlug: 'animal-crossbody-phone-bag',
    name: 'The Googly Gang animal phone bag',
    noun: ['bag', 'bags'],
    picks: ['Sloth', 'Pink Cat', 'Yellow Duck', 'Green Frog'],
    maker: 'Hui',
    // Owner, 2026-11-12: a lighter bag, so a lower price list than the others.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6495 },
      GBP: { 1: 2295, 2: 3995, 3: 4995 },
      USD: { 1: 2995, 2: 4995, 3: 6495 },
    },
    title: 'Crochet Animal Phone Bag: Sloth, Cat, Duck or Frog | The Googly Gang',
    description: 'A hand-crocheted crossbody phone bag with googly eyes and a magnetic snap. Pick a sloth, pink cat, yellow duck or green frog. Free shipping on 2 or more.',
    og: '/go/googly-gang-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'Your phone, card and keys,',
      h1em: 'carried by a little crochet critter.',
      sub: 'Pick a sloth, a pink cat, a yellow duck or a green frog. Each one is a little crossbody bag, crocheted by hand, that holds the essentials, clicks shut with a magnet and leaves your hands free.',
      image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-01.jpg', alt: 'Four crochet phone bags with googly eyes: a pink cat, a yellow duck, a brown sloth and a green frog' },
      proof: { reviewer: 'Jacqueline', date: '2026-05-31' },
    },
    story: {
      h: 'Light on your shoulder. Hard to miss.',
      paras: [
        'Some days you don’t want a handbag. You want your phone, your card and your keys, and your hands free.',
        'Each Googly Gang bag is just big enough for that. It hangs across your body, weighs about 100 g, and closes with a magnet, so there’s no zip to fight with.',
      ],
      subH: 'Why the eyes?',
      subParas: ['Because they make people smile. Each character has its own face and its own mood, from the sleepy sloth to the cheeky frog.'],
    },
    fits: {
      h: 'Made for your phone and the small stuff.',
      lede: 'It’s a slim bag, 19 cm tall and 12 cm wide. Your phone goes in, with room for a card or two, keys and lip balm.',
      specs: [
        ['Size', '19 cm tall, 12 cm wide, 2 cm deep. Measured by hand, so allow 1 to 2 cm.'],
        ['Holds', 'A phone, a few cards, keys and lip balm'],
        ['Closes', 'Magnetic snap'],
        ['Strap', '110 cm, long enough to wear crossbody'],
        ['Weight', 'About 100 g'],
        ['Made from', 'Polyester yarn'],
        ['Care', 'Hand wash in cool water. Dry flat.'],
      ],
      image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-10.jpg', alt: 'Pink cat crochet phone bag worn crossbody over a cream T-shirt' },
    },
    colours: {
      h: 'Meet the gang',
      lede: 'Same size, same price. Pick your favourite, or start a collection.',
      cards: [
        { pick: 'Sloth', title: 'The sloth', text: 'Warm brown, with two buck teeth, little white claws and a very relaxed look.', image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-02.jpg', alt: 'Brown sloth crochet phone bag with googly eyes, buck teeth and white claws' } },
        { pick: 'Pink Cat', title: 'The pink cat', text: 'Bright pink, with yellow eyes, whiskers and long legs that dangle as you walk.', image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-03.jpg', alt: 'Pink cat crochet phone bag with yellow eyes, whiskers and long dangling legs' } },
        { pick: 'Yellow Duck', title: 'The yellow duck', text: 'Sunny yellow, with a red beak and red feet.', image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-05.jpg', alt: 'Yellow duck crochet phone bag with googly eyes, a red beak and red feet' } },
        { pick: 'Green Frog', title: 'The green frog', text: 'Grass green, with a cheeky red tongue and four little legs.', image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-04.jpg', alt: 'Green frog crochet phone bag with googly eyes and a red tongue sticking out' } },
      ],
      note: 'Can’t choose? Take three, and each bag costs less.',
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Walks and errands.', 'Phone, card, keys. That’s all you need.'],
        ['Festivals and days out.', 'Small, light and on your front, where you can see it.'],
        ['Gifts.', 'A friend who loves sloths, cats, ducks or frogs is easy to shop for.'],
        ['A first bag for kids.', 'Coins, a hair clip and a few sweets have a home.'],
        ['Teens.', 'A bag that gets noticed for the right reasons.'],
      ],
      images: [
        { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-07.jpg', alt: 'Sloth crochet phone bag worn crossbody over a white T-shirt and jeans' },
        { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-09.jpg', alt: 'Pink cat crochet phone bag worn over a cream T-shirt and white skirt' },
        { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-06.jpg', alt: 'The four Googly Gang bags in a row: frog, duck, pink cat and sloth' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, one at a time.',
      paras: [
        'Hui crochets each bag in soft polyester yarn, then adds the face, the belly and the legs by hand.',
        'Because a person makes them, no two are quite the same. Legs come out a little longer or shorter, and every face has its own expression.',
      ],
      image: { src: 'products/animal-crossbody-phone-bag/animal-crossbody-phone-bag-08.jpg', alt: 'Sloth crochet phone bag worn at the hip, showing its face and claws' },
    },
    offer: {
      h: 'Pick your gang',
      lede: 'We suggest two: one for you, and one for the friend who keeps sending you animal videos. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one for a friend',
      notes: { 1: 'Just the one, for you.', 2: 'Any two characters.', 3: 'Any three, or three of a favourite.' },
      defaults: ['Pink Cat', 'Green Frog', 'Sloth'],
      proof: friend,
    },
    reviews: [sturdy, maria, asPictured, { reviewer: 'Jacqueline', date: '2026-05-31' }],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. The bag is 19 cm tall and 12 cm wide, so your phone goes in with room for a card and keys.' },
      { q: 'Does it close?', a: 'Yes, with a magnetic snap. It clicks shut on its own, so there’s no zip to open.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in cool water with a mild detergent, reshape it and lay it flat to dry. Don’t put it in the machine or the dryer.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'star-frogs',
    productSlug: 'frog-phone-crossbody',
    name: 'The Star Frogs frog phone bag',
    noun: ['frog', 'frogs'],
    picks: ['Pink', 'Blue', 'Brown'],
    maker: 'Hui',
    title: 'Crochet Frog Phone Bag in Overalls: Pink, Blue or Brown | The Star Frogs',
    description: 'A hand-crocheted frog in overalls that carries your phone in his big yellow mouth. Pink, blue or brown, mix them in a bundle. Free shipping on 2 or more.',
    og: '/go/star-frogs-og.jpg',
    bar: 'Free shipping on 2 frogs or more',
    hero: {
      h1: 'A frog in overalls',
      h1em: 'that carries your phone.',
      sub: 'Pick pink, blue or brown overalls, each with a star on the front. Your phone drops into his big yellow mouth, your hands stay free, and two straps come in the box.',
      image: { src: 'products/frog-phone-crossbody/frog-phone-crossbody-01.jpg', alt: 'Three crochet frog bags in pink, brown and blue overalls sitting on stone steps' },
      proof: { reviewer: 'Rita', date: '2025-12-20' },
    },
    story: {
      h: 'Hands free. Phone in reach.',
      paras: [
        'Your phone has to live somewhere. A back pocket isn’t safe, a handbag means digging, and holding it all day gets old.',
        'A Star Frog hangs at your hip. His mouth is the opening, with no zip or clasp, so you reach in and your phone is right there.',
      ],
      subH: 'Why overalls?',
      subParas: ['Because a frog in overalls makes people smile. Each pair has a star stitched on the front and straps that cross at the back, like the real thing.'],
    },
    fits: {
      h: 'Your phone fits. So do your keys.',
      lede: 'He’s 39 cm from head to toe and 15 cm wide. Phones up to 6.7 inches go in, with room for a card holder, keys and earbuds.',
      specs: [
        ['Size', '39 cm tall including his legs, 15 cm wide, 1 cm deep. Measured by hand, so allow 1 to 2 cm.'],
        ['Holds', 'Phones up to 6.7 inches, plus a card holder, keys and earbuds'],
        ['Opening', 'His open mouth. No zip or clasp.'],
        ['Straps', 'Two in the box, both 120 cm: a woven strap and a braided one. Both clip on with metal clasps, so you can swap them or carry him as a pouch.'],
        ['Made from', 'Polyester yarn, faux pearl, metal clasps'],
        ['Care', 'Hand wash in cool water with mild soap. Squeeze, don’t wring, and dry flat.'],
      ],
      image: { src: 'landers/star-frogs/star-frogs-size.jpg', alt: 'Blue frog bag with its size marked: 39 cm tall, 15 cm wide, 1 cm deep' },
    },
    colours: {
      h: 'Pick his overalls',
      lede: 'Same frog, three outfits. Every one has a green body, a big yellow mouth and pink cheeks.',
      cards: [
        { pick: 'Pink', title: 'Pink', text: 'Pink overalls with a yellow star. The sweet one.', image: { src: 'landers/star-frogs/star-frogs-pink-held.jpg', alt: 'Frog bag in pink overalls with a yellow star, held up in one hand' } },
        { pick: 'Blue', title: 'Blue', text: 'Sky-blue overalls with a yellow star. Easy with jeans.', image: { src: 'landers/star-frogs/star-frogs-blue-worn.jpg', alt: 'Frog bag in blue overalls worn on a brown strap over a black hoodie' } },
        { pick: 'Brown', title: 'Brown', text: 'Chocolate-brown overalls with an orange star and cream trim. The cosy one.', image: { src: 'landers/star-frogs/star-frogs-brown-worn.jpg', alt: 'Frog bag in brown overalls worn crossbody over a grey sweatshirt' } },
      ],
      note: 'Can’t pick? Take three and get one of each.',
    },
    uses: {
      h: 'Where he goes',
      items: [
        ['Coffee and a walk.', 'Phone in the frog, cup in your hand.'],
        ['Concerts and festivals.', 'He hangs at your hip, where you can keep an eye on him.'],
        ['Gifts for frog people.', 'You already know who they are.'],
        ['Teens.', 'A bag that gets noticed at school, in a good way.'],
        ['Best friends.', 'Two friends, two colours of overalls.'],
      ],
    },
    craft: {
      h: 'Crocheted by hand, overalls and all.',
      paras: [
        'Hui crochets each frog by hand: the green body, the big yellow mouth, the overalls with their crossed straps, and the star on the front.',
        'Because a person makes them, no two frogs match exactly. The legs hang a little differently, and every face has its own look.',
      ],
      image: { src: 'landers/star-frogs/star-frogs-mouth-open.webp', alt: 'The brown frog bag with its big yellow mouth held open, showing the space inside' },
    },
    offer: {
      h: 'Pick your frogs',
      lede: 'We suggest two: one for you, and one for the friend who will ask where you got yours. Two or more ship free, and each frog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two colours.', 3: 'One of each, or any three.' },
      defaults: ['Pink', 'Blue', 'Brown'],
      proof: { reviewer: 'Josie', date: '2026-01-03' },
    },
    reviews: [
      { reviewer: 'Daniel', date: '2026-01-20' },
      { reviewer: 'A happy buyer', date: '2026-01-01' },
      { reviewer: 'Geo', date: '2025-12-22' },
      { reviewer: 'Julia', date: '2026-02-13' },
      { reviewer: 'Scott', date: '2025-12-19' },
      { reviewer: 'Elijha', date: '2025-12-20' },
    ],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. Phones up to 6.7 inches fit, with room for a card holder, keys and earbuds.' },
      { q: 'Which strap does he come with?', a: 'Both: a woven strap and a braided one, each 120 cm long. They clip on with metal clasps, so you can swap them whenever you like, or take the strap off and carry him as a pouch.' },
      mouthFaq,
      kidsFaq('frog'),
      { q: 'How do I wash him?', a: 'Hand wash in cool water with mild soap. Squeeze gently, don’t wring, and lay him flat to dry.' },
      arriveFaq('frog'),
      returnsFaq,
    ],
  },
  {
    slug: 'big-mouth-monsters',
    productSlug: 'fuzzy-monster-phone-bag',
    name: 'Big Mouth Monsters phone bag',
    noun: ['monster', 'monsters'],
    picks: ['Pink', 'Yellow'],
    maker: 'Hui',
    // Owner, 2026-11-12: same lighter price list as the Googly Gang.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6495 },
      GBP: { 1: 2295, 2: 3995, 3: 4995 },
      USD: { 1: 2995, 2: 4995, 3: 6495 },
    },
    title: 'Fuzzy Crochet Monster Phone Bag: Pink or Yellow | Big Mouth Monsters',
    description: 'A shaggy hand-crocheted monster with wings and a wide-open mouth that holds your phone. Pink or yellow, about 80 g. Free shipping on 2 or more.',
    og: '/go/big-mouth-monsters-og.jpg',
    bar: 'Free shipping on 2 monsters or more',
    hero: {
      h1: 'A fuzzy monster that holds your phone,',
      h1em: 'and hands it straight back.',
      sub: 'Two shaggy little crochet monsters with wings and big eyes: one pink, one yellow. The wide mouth is the opening, so your phone, lip gloss and earbuds are one reach away. No zip, no digging.',
      image: { src: 'landers/big-mouth-monsters/big-mouth-monsters-pair-step.webp', alt: 'Pink and yellow fuzzy crochet monster bags with wings and wide orange and peach mouths, sitting on a stone step' },
      proof: { reviewer: 'A happy buyer', date: '2026-03-07' },
    },
    story: {
      h: 'Fuzzy on the outside. Handy on the inside.',
      paras: [
        'Most phone bags try to blend in. These two don’t.',
        'They’re soft, shaggy and weigh about 80 g, so they hang light at your side. The mouth stays open, so you reach straight in without hunting for a zip.',
      ],
      subH: 'Why a mouth?',
      subParas: ['A zip needs two hands. A mouth needs one. And it’s a lot more fun.'],
    },
    fits: {
      h: 'Your phone and the little things.',
      lede: 'They’re 31 cm tall and 11 cm wide. Phones up to 6.5 inches go in, with room for a card holder, lip gloss and earbuds.',
      specs: [
        ['Size', '31 cm tall including the wings and legs, 11 cm wide, 1 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'Phones up to 6.5 inches, plus a card holder, lip gloss and earbuds'],
        ['Opening', 'The wide mouth. No zip or clasp.'],
        ['Strap', '120 cm braided strap in the same colour as the monster'],
        ['Weight', 'About 80 g'],
        ['Made from', 'Polyester plush and yarn'],
        ['Care', 'Hand wash in cool water and dry flat. A little fluff may shed at first.'],
      ],
      image: { src: 'landers/big-mouth-monsters/big-mouth-monsters-yellow-phone.jpg', alt: 'Yellow monster bag lying next to a phone, showing its size' },
    },
    colours: {
      h: 'Pick your monster',
      lede: 'Same shaggy shape, two very different moods.',
      cards: [
        { pick: 'Pink', title: 'The pink one', text: 'Pink fur, grey wings and antennae, a bright orange mouth, and green boots with purple socks.', image: { src: 'landers/big-mouth-monsters/big-mouth-monsters-pink-worn.jpg', alt: 'Pink fuzzy monster bag on its pink braided strap, worn over a grey sweatshirt' } },
        { pick: 'Yellow', title: 'The yellow one', text: 'Yellow fur, blue and white wings, rosy cheeks, a peach mouth, and one brown boot.', image: { src: 'landers/big-mouth-monsters/big-mouth-monsters-yellow-tile.jpg', alt: 'Yellow fuzzy monster bag with blue and white wings and a peach mouth, sitting by a wicker basket' } },
      ],
      note: 'Can’t choose? Take two and get one of each.',
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Festivals and concerts.', 'Light, on your front, and easy to spot in a crowd.'],
        ['Conventions.', 'A bag that fits right in with a costume.'],
        ['Errands.', 'Phone, card and lip gloss, and nothing else to carry.'],
        ['Gifts.', 'For the friend who loves weird and cute in equal measure.'],
        ['Teens.', 'A bag that gets noticed at school, in a good way.'],
      ],
      images: [
        { src: 'landers/big-mouth-monsters/big-mouth-monsters-yellow-worn.jpg', alt: 'Yellow monster bag worn crossbody over a black jumper and white lace skirt' },
        { src: 'landers/big-mouth-monsters/big-mouth-monsters-stairs-pair.jpg', alt: 'Pink and yellow monster bags sitting together on a stair' },
      ],
    },
    craft: {
      h: 'Shaggy, and made by hand.',
      paras: [
        'Hui crochets each monster by hand, then adds the fur, the wings, the antennae and the big round eyes.',
        'No two come out quite the same. The fur falls its own way, and every face has its own surprised look.',
      ],
      image: { src: 'landers/big-mouth-monsters/big-mouth-monsters-yellow-held.jpg', alt: 'Yellow monster bag held up by its braided yellow strap' },
    },
    offer: {
      h: 'Pick your monsters',
      lede: 'We suggest two: the pink one and the yellow one. Keep both, or give one to a friend. Two or more ship free, and each monster costs less.',
      flag2: 'One of each',
      notes: { 1: 'Just the one, for you.', 2: 'One of each, or a matching pair.', 3: 'Any three.' },
      defaults: ['Pink', 'Yellow', 'Pink'],
      proof: { reviewer: 'A happy buyer', date: '2026-03-07' },
    },
    reviews: [{ reviewer: 'A happy buyer', date: '2026-03-07' }, maria, asPictured, sturdy],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. Phones up to 6.5 inches fit, with room for a card holder, lip gloss and earbuds.' },
      { q: 'Does the mouth close?', a: 'No. There is no zip, clasp or magnet, so you reach straight in. On a crowded train, wear it across your front.' },
      kidsFaq('monster'),
      { q: 'How do I wash it?', a: 'Hand wash in cool water with mild soap and lay it flat to dry. It may shed a little fluff at first.' },
      arriveFaq('monster'),
      returnsFaq,
    ],
  },
  {
    slug: 'fruit-bellies',
    productSlug: 'animal-coasters-cat-pig-and-bear',
    name: 'The Fruit Bellies animal coaster',
    noun: ['coaster', 'coasters'],
    picks: ['Cat', 'Pig', 'Bear'],
    maker: 'Hui',
    shop: ['/shop/coasters/', 'Coasters'],
    // Owner, 2026-11-12: one €19.95, two €34.95, the set of three €49.95.
    prices: {
      EUR: { 1: 1995, 2: 3495, 3: 4995 },
      GBP: { 1: 1695, 2: 2995, 3: 3995 },
      USD: { 1: 1995, 2: 3495, 3: 4995 },
    },
    title: 'Crochet Animal Coasters: Pig, Bear and Cat with Fruit | The Fruit Bellies',
    description: 'Hand-crocheted animal coasters with fruit bellies: a watermelon pig, an orange bear and a kiwi cat. About 15 cm across, thick and soft. Free shipping on 2 or more.',
    og: '/go/fruit-bellies-og.jpg',
    bar: 'Free shipping on 2 coasters or more',
    hero: {
      h1: 'Three little animals',
      h1em: 'that keep rings off your table.',
      sub: 'Pick a pig with a watermelon belly, a bear with an orange slice or a cat with a kiwi. Each one is a thick, soft crochet coaster about 15 cm across, so your mug sits on the fruit, not the wood.',
      image: { src: 'landers/fruit-bellies/fruit-bellies-trio.jpg', alt: 'Three crochet animal coasters: a bear with an orange slice, a pig with a watermelon and a cat with a kiwi' },
      proof: sturdy,
    },
    story: {
      h: 'A coaster people actually leave out.',
      paras: [
        'Most coasters live in a drawer until someone remembers them. These ones stay on the table, because people like looking at them.',
        'Each Fruit Belly is thick, soft crochet, about 60 g, so it sits still under a mug and keeps a hot cup or a cold glass off the wood.',
      ],
      subH: 'Why fruit?',
      subParas: ['Because a pig with a watermelon belly makes a cup of tea more fun. The fruit is where your mug goes.'],
    },
    fits: {
      h: 'Big enough for your biggest mug.',
      lede: 'Each one is about 15 cm across, so a large mug, a glass or a candle sits right on the fruit.',
      specs: [
        ['Size', 'About 15 cm across and 3.5 cm thick. Measured by hand, so allow 1 to 3 cm.'],
        ['Good for', 'Mugs, glasses and candles'],
        ['Weight', 'About 60 g each'],
        ['Made from', 'Polyester-acrylic yarn, with safety eyes'],
        ['Care', 'Hand wash in cool or lukewarm water, below 40°C. Dry flat.'],
      ],
      image: { src: 'products/animal-coasters-cat-pig-and-bear/animal-coasters-cat-pig-and-bear-07.jpg', alt: 'A glass sitting on the bear coaster' },
    },
    colours: {
      h: 'Meet the Fruit Bellies',
      lede: 'Three animals, three fruits. Pick a favourite, or get the whole set.',
      cards: [
        { pick: 'Cat', title: 'The cat', text: 'Cream with ginger stripes, two-tone ears, a kiwi belly and a striped tail.', image: { src: 'landers/fruit-bellies/fruit-bellies-cat.jpg', alt: 'Cream crochet cat coaster with ginger stripes and a kiwi centre' } },
        { pick: 'Pig', title: 'The pig', text: 'Soft pink with a snout, little trotters, a watermelon belly and a tail.', image: { src: 'landers/fruit-bellies/fruit-bellies-pig.jpg', alt: 'Pink crochet pig coaster with a watermelon centre' } },
        { pick: 'Bear', title: 'The bear', text: 'Caramel brown with round ears, a white muzzle and an orange-slice belly.', image: { src: 'landers/fruit-bellies/fruit-bellies-bear.jpg', alt: 'Brown crochet bear coaster with an orange-slice centre' } },
      ],
      note: 'Can’t pick? Take three and get the whole set.',
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Morning coffee.', 'Your mug lands on a kiwi, not the table.'],
        ['The desk.', 'Tea next to the laptop, and no rings.'],
        ['The coffee table.', 'Glasses down, wood protected.'],
        ['Housewarmings.', 'A present people put straight out on the table.'],
        ['Kids’ tables.', 'A juice cup with a friendly face under it.'],
      ],
      images: [
        { src: 'products/animal-coasters-cat-pig-and-bear/animal-coasters-cat-pig-and-bear-06.jpg', alt: 'A glass sitting on the cat coaster' },
        { src: 'products/animal-coasters-cat-pig-and-bear/animal-coasters-cat-pig-and-bear-08.jpg', alt: 'A glass sitting on the pig coaster' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, fruit and all.',
      paras: [
        'Hui crochets each coaster by hand: the round body, the fruit belly in rings of colour, then the ears, paws and tail.',
        'Because a person makes them, no two come out exactly alike. The faces sit a little differently, and every tail has its own bend.',
      ],
      image: { src: 'landers/fruit-bellies/fruit-bellies-stack.jpg', alt: 'The pig, bear and cat coasters stacked on top of each other' },
    },
    offer: {
      h: 'Pick your coasters',
      lede: 'We suggest two: one for your mug, and one for whoever you’re having tea with. Or take the whole set. Two or more ship free, and each coaster costs less.',
      flag2: 'Tea for two',
      notes: { 1: 'Just the one.', 2: 'Any two animals.', 3: 'The whole set, or any three.' },
      defaults: ['Pig', 'Cat', 'Bear'],
      proof: friend,
    },
    reviews: [sturdy, maria, asPictured],
    faq: [
      { q: 'Will my mug fit?', a: 'Yes. Each coaster is about 15 cm across, with room for a large mug, a glass or a candle.' },
      { q: 'Do they protect the table?', a: 'Yes. They’re thick, soft crochet, so a hot mug or a cold glass never touches the wood.' },
      { q: 'Can I buy just one?', a: 'Yes. Pick one animal, two, or the whole set of three. Two or more ship free.' },
      { q: 'How do I wash them?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay them flat to dry.' },
      arriveFaq('coasters'),
      returnsFaq,
    ],
  },
  {
    slug: 'doll-squad',
    productSlug: 'girl-face-crossbody-purse',
    name: 'The Doll Squad phone bag',
    noun: ['bag', 'bags'],
    picks: ['Yellow', 'Pink', 'Green'],
    maker: 'Hui',
    // Owner, 2026-11-12: the lighter price list, as for the Googly Gang.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6495 },
      GBP: { 1: 2295, 2: 3995, 3: 4995 },
      USD: { 1: 2995, 2: 4995, 3: 6495 },
    },
    title: 'Crochet Doll Face Phone Bag: Curls, Beanie or Braids | The Doll Squad',
    description: 'A hand-crocheted crossbody phone bag with a doll face, yarn hair and a little charm. Three girls to pick from, about 90 g. Free shipping on 2 or more.',
    og: '/go/doll-squad-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'Your phone, carried by a girl',
      h1em: 'with better hair than yours.',
      sub: 'Pick purple curls with a starfish, brown curls under a red beanie, or purple braids with a faux pearl. Each one is a little hand-crocheted crossbody bag for your phone, keys and lip balm, so your hands stay free.',
      image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-01.jpg', alt: 'Three crochet doll-face phone bags with yarn hair: purple curls, a red beanie and purple braids' },
      proof: { reviewer: 'Jacqueline', date: '2026-05-31' },
    },
    story: {
      h: 'Small bag, big personality.',
      paras: [
        'Some days you only need your phone, your keys and a lip balm. A handbag is too much, and pockets are never enough.',
        'Each Doll Squad bag is just that size. It hangs across your body, weighs about 90 g, and has a face that makes people smile.',
      ],
      subH: 'Why three girls?',
      subParas: ['Because everyone has a favourite. Each one has her own hair and her own little charm, so friends can pick one each.'],
    },
    fits: {
      h: 'Your phone fits. So does the small stuff.',
      lede: 'She’s 18 cm tall and 11 cm wide. Your phone goes in, with room for keys, lip balm, tissues and a bus card.',
      specs: [
        ['Size', '18 cm tall, 11 cm wide, 1 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'A phone, keys, lip balm, tissues and a bus card'],
        ['Strap', '120 cm, adjustable: crossbody, on one shoulder or in the hand'],
        ['Weight', 'About 90 g'],
        ['Made from', 'Knitted polyester yarn'],
        ['Care', 'Hand wash in lukewarm water, below 40°C. Dry flat, out of direct sun.'],
      ],
      image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-09.jpg', alt: 'Size guide for the doll-face bag: 18 cm tall, 11 cm wide, 1 cm deep, 120 cm strap' },
    },
    colours: {
      h: 'Meet the Doll Squad',
      lede: 'Same size, same price. Each girl has her own hair and her own charm.',
      cards: [
        { pick: 'Yellow', title: 'Curls and a starfish', text: 'Purple curls, a green starfish and a little candy charm, on a yellow, blue and orange bag.', image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-02.jpg', alt: 'Yellow doll-face bag with purple curls and a green starfish, worn crossbody' } },
        { pick: 'Pink', title: 'Braids and a pearl', text: 'Purple braids, a yellow flower and a hanging faux pearl, on a peach and pink bag.', image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-06.jpg', alt: 'Pink doll-face bag with purple braids and a yellow flower, worn crossbody' } },
        { pick: 'Green', title: 'The red beanie', text: 'Brown curls under a red knit beanie, on a mint and green bag.', image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-04.jpg', alt: 'Green doll-face bag with brown curls under a red beanie, worn crossbody' } },
      ],
      note: 'Can’t pick? Take three and get the whole squad.',
    },
    uses: {
      h: 'Where she goes',
      items: [
        ['Coffee and errands.', 'Phone, card and keys, and your hands are free.'],
        ['Days out with friends.', 'Three friends, three girls. Everyone gets a favourite.'],
        ['A first bag for kids.', 'Coins, small toys and sweets have a home. The strap shortens to fit.'],
        ['Birthdays.', 'A gift with a face that already looks happy to see them.'],
        ['Teens.', 'A bag that gets noticed at school, in a good way.'],
      ],
      images: [
        { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-03.jpg', alt: 'Yellow doll-face bag worn over a beige hoodie' },
        { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-05.jpg', alt: 'Green doll-face bag worn crossbody, with a phone in hand' },
        { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-08.jpg', alt: 'Pink doll-face bag worn over a cream jumper' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, curl by curl.',
      paras: [
        'Hui crochets each bag by hand, embroiders the face, then adds the hair one curl or braid at a time, and finally her charm: a starfish, a beanie or a pearl.',
        'Because a person makes them, no two come out quite the same. The curls fall their own way, and every face has its own little smile.',
      ],
      image: { src: 'products/girl-face-crossbody-purse/girl-face-crossbody-purse-10.jpg', alt: 'Close-up of the red knit beanie and the strap clip on the green doll-face bag' },
    },
    offer: {
      h: 'Pick your squad',
      lede: 'We suggest two: one for you, and one for your best friend. Two or more ship free, and each bag costs less.',
      flag2: 'Best friends',
      notes: { 1: 'Just the one, for you.', 2: 'Any two girls.', 3: 'The whole squad, or any three.' },
      defaults: ['Yellow', 'Pink', 'Green'],
      proof: friend,
    },
    reviews: [sturdy, maria, asPictured],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. She’s 18 cm tall and 11 cm wide, made for a phone, with room for keys, lip balm and a bus card.' },
      { q: 'What’s the difference between them?', a: 'Only the look. Yellow has purple curls and a starfish, green has brown curls under a red beanie, and pink has purple braids with a faux pearl. Same size, same price.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in lukewarm water, below 40°C, and lay it flat to dry, out of direct sun.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'pocket-garden',
    productSlug: 'flower-crossbody-bag-with-detachable-strap',
    name: 'Pocket Garden flower bag',
    noun: ['bag', 'bags'],
    picks: ['Purple', 'Green', 'Blue'],
    maker: 'Hui',
    // Owner, 2026-11-12: the lighter price list.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6495 },
      GBP: { 1: 2295, 2: 3995, 3: 4995 },
      USD: { 1: 2995, 2: 4995, 3: 6495 },
    },
    title: 'Crochet Flower Crossbody Phone Bag with Handle | Pocket Garden',
    description: 'A hand-crocheted flower bag you carry two ways: by its handle, or crossbody on a clip-on strap. A wooden button keeps your phone in. Free shipping on 2 or more.',
    og: '/go/pocket-garden-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'A pocket-sized garden',
      h1em: 'that carries your phone two ways.',
      sub: 'Rows of hand-crocheted flowers in purple and pink, green and orange, or blue and red. Carry it by its little handle, or clip on the long strap and wear it crossbody. A wooden button keeps your phone, keys and lip balm inside.',
      image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-01.webp', alt: 'Three crochet flower bags: purple with pink flowers, blue with red flowers and green with orange flowers' },
      proof: { reviewer: 'Caitlin', date: '2026-02-13' },
    },
    story: {
      h: 'Two bags in one.',
      paras: [
        'Some days you want your hands free. Other days you want to carry something pretty.',
        'This bag does both. Clip on the 120 cm strap and wear it across your body. Unclip it, and it’s a little top-handle bag for a dinner, a wedding or a day in town.',
      ],
      subH: 'Why a button?',
      subParas: ['Because it keeps things in. A wooden button closes the top, so your phone stays put, with no zip to fight.'],
    },
    fits: {
      h: 'Your phone fits, buttoned in.',
      lede: 'It’s 19 cm tall and 16 cm wide. Your phone goes in, with room for keys, lip balm, tissues and a bus card.',
      specs: [
        ['Size', '19 cm tall, 16 cm wide, 1 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Holds', 'A phone, keys, lip balm, tissues and a bus card'],
        ['Closes', 'Wooden button'],
        ['Carry', 'By the crocheted top handle, or crossbody on the 120 cm clip-on strap'],
        ['Weight', 'About 90 g'],
        ['Made from', 'Polyester yarn, wooden button'],
        ['Care', 'Hand wash in cool or lukewarm water, below 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-09.webp', alt: 'Purple flower bag open, with a phone and a compact inside' },
    },
    colours: {
      h: 'Pick your flowers',
      lede: 'Same bag, three gardens. Every one is the same size and the same price.',
      cards: [
        { pick: 'Purple', title: 'Purple and pink', text: 'Lilac, with pink and violet flowers and a purple handle. The soft one.', image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-02.webp', alt: 'Purple crochet flower bag with pink flowers, a top handle and a wooden button' } },
        { pick: 'Green', title: 'Green and orange', text: 'Grass green, with bright orange flowers. The sunny one.', image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-03.webp', alt: 'Green crochet flower bag with orange flowers and a top handle' } },
        { pick: 'Blue', title: 'Blue and red', text: 'Sky blue, with red flowers and a red handle. The bold one.', image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-04.webp', alt: 'Blue crochet flower bag with red flowers and a red top handle' } },
      ],
      note: 'Can’t pick? Take three and get the whole garden.',
    },
    uses: {
      h: 'Where it goes',
      items: [
        ['Weddings and dinners.', 'Carry it by the handle, like a little clutch.'],
        ['Days out.', 'Strap on, hands free, phone in reach.'],
        ['Summer markets.', 'Light, bright and just big enough for the basics.'],
        ['Gifts.', 'For the friend whose home is full of plants.'],
        ['A first “big kid” bag.', 'Coins, small toys and sweets, buttoned in.'],
      ],
      images: [
        { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-05.webp', alt: 'Purple flower bag worn crossbody over a cream T-shirt and white skirt' },
        { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-06.webp', alt: 'Green flower bag worn crossbody over a white dress' },
        { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-07.webp', alt: 'Blue flower bag worn crossbody, with a phone in hand' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, flower by flower.',
      paras: [
        'Hui crochets each flower on its own, joins them into one little bag, then adds the handle and sews on the wooden button.',
        'Because a person makes them, no two come out quite the same. The petals sit a little differently on every bag.',
      ],
      image: { src: 'products/flower-crossbody-bag-with-detachable-strap/flower-crossbody-bag-with-detachable-strap-08.webp', alt: 'Purple flower bag laid flat with its long cream strap clipped on' },
    },
    offer: {
      h: 'Pick your garden',
      lede: 'We suggest two: one for you, and one for a friend who loves flowers as much as you do. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one for a friend',
      notes: { 1: 'Just the one, for you.', 2: 'Any two colours.', 3: 'The whole garden, or any three.' },
      defaults: ['Purple', 'Green', 'Blue'],
      proof: friend,
    },
    reviews: [{ reviewer: 'Caitlin', date: '2026-02-13' }, maria, asPictured, sturdy],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. It’s 19 cm tall and 16 cm wide, with room for keys, lip balm and a bus card beside your phone.' },
      { q: 'Does the strap come off?', a: 'Yes. The 120 cm strap clips on and off. Wear it crossbody, or take the strap off and carry the bag by its crocheted handle.' },
      { q: 'How does it close?', a: 'With a wooden button at the top. No zip and no magnet.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay it flat to dry. Keep it out of strong sun for long periods, as sun can fade the colours.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'fold-and-bloom',
    productSlug: 'carnation-mug-rug-that-folds-into-a-mini',
    name: 'Fold & Bloom carnation mug rugs',
    noun: ['pair', 'pairs'],
    picks: ['Pink', 'Purple', 'Mixed'],
    per: 2,
    maker: 'Hui',
    shop: ['/shop/coasters/', 'Coasters'],
    // Owner, 2026-11-12: sets of 2, 4 and 6 (sold as pairs), on the listing's ladder:
    // 2 €24.95, 4 €44.95, 6 €59.95. Buyers pick each pair: pink, purple or one of each.
    prices: {
      EUR: { 1: 2495, 2: 4495, 3: 5995 },
      GBP: { 1: 2195, 2: 3795, 3: 4995 },
      USD: { 1: 2495, 2: 4495, 3: 5995 },
    },
    title: 'Crochet Carnation Coasters That Fold Into a Bouquet | Fold & Bloom',
    description: 'Hand-crocheted carnation mug rugs that fold into a mini bouquet, then open flat under a mug. Pink, purple or mixed, 14.5 cm across. Sets of 2, 4 or 6.',
    og: '/go/fold-and-bloom-og.jpg',
    bar: 'Free shipping on sets of 4 or more',
    hero: {
      h1: 'A crochet carnation bouquet',
      h1em: 'that unfolds into a coaster for your mug.',
      sub: 'Hui crochets each carnation onto a soft cream coaster with a leafy stem. Fold it into a cone and tie the leaf cord, and it’s a bouquet. Untie it, and it lies flat under a mug, 14.5 cm across.',
      image: { src: 'landers/fold-and-bloom/fold-and-bloom-hero.jpg', alt: 'Four crochet carnation bouquets folded into cones and tied with green leaf cords, two purple and two pink' },
      proof: friend,
    },
    story: {
      h: 'Flowers that don’t end up in the bin.',
      paras: [
        'Cut flowers look lovely for a week. These carnations are still on the table months later, under a cup of tea.',
        'Each one folds into a cone and ties with its own leaf cord, so you hand it over like a fresh-cut stem. When they untie it, the surprise is that it’s a coaster.',
      ],
      subH: 'Why carnations?',
      subParas: ['They’re a favourite for Mother’s Day and birthdays, and their ruffled petals look just as good in crochet as in a vase.'],
    },
    fits: {
      h: 'Big enough for a mug.',
      lede: 'Each coaster is 14.5 cm across. The carnation sits at the edge, so your mug or glass sits flat on the crochet.',
      specs: [
        ['Size', 'Coaster 14.5 cm across and 0.5 cm thick, carnation about 8 cm. Made by hand, so allow 1 to 2 cm.'],
        ['Good for', 'Mugs, teacups and glasses'],
        ['Weight', 'About 20 g each'],
        ['Made from', 'Acrylic yarn'],
        ['Folding', 'Folds into a bouquet and back without creasing'],
        ['Care', 'Hand wash in cool water, below 40°C. Don’t wring. Dry flat.'],
      ],
      image: { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-07.jpg', alt: 'A glass tumbler sitting on a cream crochet coaster with a purple carnation at its edge' },
    },
    colours: {
      h: 'Pick your pairs',
      lede: 'Carnations come in pairs. Choose a pink pair, a purple pair, or one of each.',
      cards: [
        { pick: 'Pink', title: 'Pink pair', text: 'Two soft pink carnations. Sweet for a birthday or Mother’s Day.', image: { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-06.jpg', alt: 'A pink crochet carnation folded into a bouquet and tied with a green leaf cord' } },
        { pick: 'Purple', title: 'Purple pair', text: 'Two deep purple carnations. Rich against a wooden table.', image: { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-05.jpg', alt: 'A purple crochet carnation folded into a bouquet and tied with a green leaf cord' } },
        { pick: 'Mixed', title: 'Mixed pair', text: 'One pink and one purple, like the pair in our photos.', image: { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-02.jpg', alt: 'A purple and a pink crochet carnation bouquet side by side' } },
      ],
      note: 'Getting four or six? Mix your pairs however you like.',
    },
    uses: {
      h: 'Who they’re for',
      items: [
        ['Mother’s Day.', 'A bouquet she keeps on the table.'],
        ['Birthdays.', 'At about 20 g each, they tuck in beside a card.'],
        ['Thank-yous.', 'For a teacher, a neighbour or a friend. A small gift that gets used every day.'],
        ['Housewarmings.', 'Six bouquets for a new kitchen table.'],
        ['Your own table.', 'A coaster for your morning coffee or tea.'],
      ],
      images: [
        { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-08.jpg', alt: 'Four carnation coasters stacked, with pink and purple flowers around the edge' },
        { src: 'products/carnation-mug-rug-that-folds-into-a-mini/carnation-mug-rug-that-folds-into-a-mini-04.jpg', alt: 'A pink carnation coaster lying flat, with its green stem across the cream crochet' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, petal by petal.',
      paras: [
        'Hui crochets each coaster in cream granny stitch, then works the ruffled carnation, the leafy stem and the leaf cord that ties the bouquet.',
        'Because a person makes them, no two carnations ruffle quite the same way.',
      ],
      image: { src: 'landers/fold-and-bloom/fold-and-bloom-craft.jpg', alt: 'A purple carnation coaster lying flat next to a ball of purple yarn' },
    },
    offer: {
      h: 'Pick your bouquets',
      lede: 'We suggest four: two to keep, two to give. Sets of four or six ship free, and each coaster costs less.',
      flag2: 'Two to keep, two to give',
      notes: { 1: 'One pair.', 2: 'Any two pairs.', 3: 'Any three pairs.' },
      defaults: ['Mixed', 'Pink', 'Purple'],
      proof: sturdy,
    },
    reviews: [friend, maria, asPictured],
    faq: [
      { q: 'Will my mug fit?', a: 'Yes. Each coaster is 14.5 cm across, and the carnation sits at the edge, so a mug or a glass sits flat on the crochet.' },
      { q: 'How do I fold it into a bouquet?', a: 'Roll the coaster into a cone around the stem, with the carnation at the top, and tie it with the leaf cord. Untie it to use it as a coaster.' },
      { q: 'Does folding crease it?', a: 'No. The yarn is soft enough to fold into a bouquet and back without leaving creases.' },
      { q: 'What’s in a set?', a: 'Sets come in pairs: two, four or six coasters. Pick each pair in pink, purple, or one of each. Sets of four or six ship free.' },
      { q: 'How do I wash them?', a: 'Hand wash in cool water, below 40°C. Don’t wring them, and lay them flat to dry.' },
      arriveFaq('coasters'),
      returnsFaq,
    ],
  },
  {
    slug: 'pearl-and-daisy',
    productSlug: 'fat-lips-girl-crossbody-phone-bag-with-daisy',
    name: 'Pearl & Daisy doll bag',
    noun: ['bag', 'bags'],
    picks: ['Large 28 x 11 cm', 'Small 20 x 10 cm'],
    maker: 'Hui',
    // Owner, 2026-11-12: one large, one small, or a set of one large + one small. Keep the
    // listing prices: large €32.95, small €27.95; the set €49.95, shipping free.
    sizes: {
      1: { option: 'Small, 20 cm', label: 'Small bag', pieces: 1, pick: 'Small 20 x 10 cm' },
      2: { option: 'Large, 28 cm', label: 'Large bag', pieces: 1, pick: 'Large 28 x 11 cm' },
      3: { option: 'Set: 1 large + 1 small', label: 'Big & little set', pieces: 2 },
    },
    prices: {
      EUR: { 1: 2795, 2: 3295, 3: 4995 },
      GBP: { 1: 2395, 2: 2795, 3: 4195 },
      USD: { 1: 2795, 2: 3295, 3: 4995 },
    },
    title: 'Crochet Doll Phone Bag with Red Lips and Pearls | Pearl & Daisy',
    description: 'A hand-crocheted doll phone bag with big red lips, pearls and a daisy. Large 28 cm or small 20 cm, or both as a matching set that ships free.',
    og: '/go/pearl-and-daisy-og.jpg',
    bar: 'Free shipping on the big & little set',
    hero: {
      h1: 'Big red lips, pearls and a daisy,',
      h1em: 'on a crochet bag that carries your phone.',
      sub: 'Pick the large, 28 cm tall with room for your phone and cards, or the small, 20 cm tall, made for a phone on its own. Or get both as a matching big and little set.',
      image: { src: 'products/fat-lips-girl-crossbody-phone-bag-with-daisy/fat-lips-girl-crossbody-phone-bag-with-daisy-03.jpg', alt: 'The large and the small crochet doll bags side by side, each with big red lips, a pearl necklace and a daisy' },
      proof: asPictured,
    },
    story: {
      h: 'Made to be noticed.',
      paras: [
        'She has big red pouty lips, pearl beads in her curly blonde hair and around her neck, and a daisy on her dress. Even her feet get polka-dot bows.',
        'Hui crochets every one by hand, from her curls down to her bows.',
      ],
      subH: 'Why two sizes?',
      subParas: ['The large is an everyday phone bag with room for a few extras. The small is the same doll, lighter, for days you only carry your phone. Together they make a matching pair.'],
    },
    fits: {
      h: 'Two sizes, both made for your phone.',
      lede: 'The large fits most phones with room for cards or a key. The small is snugger, made for a phone on its own.',
      specs: [
        ['Large', '28 cm tall, 11 cm wide, 1 cm deep, on a 105 cm strap. About 140 g.'],
        ['Small', '20 cm tall, 10 cm wide, 1 cm deep, on a 100 cm strap. About 80 g.'],
        ['Sizing', 'Measured by hand, so allow 1 to 3 cm.'],
        ['Wear it', 'Over the shoulder or crossbody'],
        ['Opening', 'Open top, no zip or clasp'],
        ['Made from', 'Polyester yarn, faux pearls'],
        ['Care', 'Hand wash in cool water with mild soap, reshape and dry flat. Go gently on the pearls.'],
      ],
      image: { src: 'products/fat-lips-girl-crossbody-phone-bag-with-daisy/fat-lips-girl-crossbody-phone-bag-with-daisy-09.jpg', alt: 'The doll bag lying next to a phone, with its long braided strap' },
    },
    uses: {
      h: 'Where she goes',
      items: [
        ['Every day.', 'Phone in, hands free.'],
        ['Matching days.', 'The big one for you, the little one for your daughter or your best friend.'],
        ['Gifts.', 'For anyone who loves cute, unusual things.'],
        ['Weekends.', 'Light enough to forget she’s there.'],
      ],
      images: [
        { src: 'products/fat-lips-girl-crossbody-phone-bag-with-daisy/fat-lips-girl-crossbody-phone-bag-with-daisy-02.jpg', alt: 'The doll bag worn crossbody over a grey sweatshirt' },
        { src: 'products/fat-lips-girl-crossbody-phone-bag-with-daisy/fat-lips-girl-crossbody-phone-bag-with-daisy-05.jpg', alt: 'The doll bag worn crossbody over a navy jumper' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, curls and all.',
      paras: [
        'Hui crochets each doll by hand: the curly hair, the big red lips, the dress with its stitched crosses and the legs with their bows. Then she adds the pearls and the daisy.',
        'Because a person makes her, no two come out exactly alike.',
      ],
      image: { src: 'products/fat-lips-girl-crossbody-phone-bag-with-daisy/fat-lips-girl-crossbody-phone-bag-with-daisy-07.jpg', alt: 'Close-up of the thick red crochet lips, the pearl necklace and the white daisy' },
    },
    offer: {
      h: 'Pick your size',
      lede: 'One bag, or both sizes together. The big and little set ships free, and costs less than buying the two.',
      flag2: 'Matching pair',
      notes: { 1: 'Fits a phone.', 2: 'Fits a phone and cards.', 3: 'One large and one small.' },
      defaults: ['Large 28 x 11 cm', 'Large 28 x 11 cm', 'Large 28 x 11 cm'],
      proof: friend,
    },
    reviews: [friend, sturdy, maria],
    faq: [
      { q: 'Which size should I get?', a: 'The large if you carry a phone plus cards or a key. The small if it’s just your phone. Or get both as the set.' },
      { q: 'What’s in the set?', a: 'One large bag and one small bag, the same doll in both sizes. The set ships free.' },
      { q: 'How long is the strap?', a: 'The large comes on a 105 cm strap and the small on a 100 cm strap. Wear either over the shoulder or crossbody.' },
      { q: 'Does it close?', a: 'No. The top is open, with no zip or clasp, so you reach straight in. On a crowded train, wear it across your front.' },
      { q: 'How do I wash it?', a: 'Hand wash in cool water with mild soap, reshape and lay flat to dry. Go gently on the pearls.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'pigtail-pals',
    productSlug: 'big-eye-girl-bag',
    name: 'Pigtail Pals phone bag',
    noun: ['bag', 'bags'],
    picks: ['Pink', 'Purple', 'Blue', 'Green'],
    maker: 'Hui',
    // Owner, 2026-11-12: the lighter price list, as for the Googly Gang.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6495 },
      GBP: { 1: 2295, 2: 3995, 3: 4995 },
      USD: { 1: 2995, 2: 4995, 3: 6495 },
    },
    title: 'Crochet Big Eye Phone Bag with Fuzzy Pigtails | Pigtail Pals',
    description: 'A hand-crocheted drawstring phone bag with big round eyes and fuzzy pigtail hair. Pink, purple, blue or green, about 140 g. Free shipping on 2 or more.',
    og: '/go/pigtail-pals-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'Big round eyes and fuzzy pigtails,',
      h1em: 'on a drawstring bag for your phone and keys.',
      sub: 'Hui crochets each one in a flecked tweed yarn, with curly brown hair tied into two pigtails and a little flower. Pull the cords to close it, and the same cords are the strap. Pink, purple, blue or green.',
      image: { src: 'landers/pigtail-pals/pigtail-pals-group.jpg', alt: 'Four crochet bags with big round eyes and fuzzy brown pigtail hair, in purple, green, blue and pink, sitting on stone steps' },
      proof: asPictured,
    },
    story: {
      h: 'A bag with a bit of personality.',
      paras: [
        'Most little bags are plain. This one looks back at you, with two big round eyes under a mop of curly hair.',
        'The tweed yarn has flecks of pink, yellow and blue running through it, so the colour looks different up close than from across the room.',
      ],
      subH: 'How does it close?',
      subParas: ['With a drawstring. Pull the cords and the top gathers shut. The same cords make the 110 cm strap.'],
    },
    fits: {
      h: 'Room for your phone and the small things.',
      lede: 'She fits most phones, plus lipstick, tissues, keys or a bus card.',
      specs: [
        ['Size', '25 cm tall, 15 cm wide at the top and 13 cm at the base. Measured by hand, so allow 1 to 3 cm.'],
        ['Strap', '110 cm drawstring cords, worn crossbody or over the shoulder'],
        ['Closes', 'Drawstring'],
        ['Weight', 'About 140 g'],
        ['Made from', 'Tweed-look crochet yarn, fuzzy yarn hair, polyester cords'],
        ['Care', 'Hand wash in cool or lukewarm water, below 40°C. Dry flat, away from strong sun.'],
      ],
      image: { src: 'products/big-eye-girl-bag/big-eye-girl-bag-09.jpg', alt: 'The pink bag worn crossbody over a grey sweatshirt, a hand on the pink cord' },
    },
    colours: {
      h: 'Pick your Pigtail Pal',
      lede: 'The same fuzzy hair in four colours. The cords, flower and feet match the body.',
      cards: [
        { pick: 'Pink', title: 'Pink', text: 'Pink tweed with pink cords, a pink flower and round pink feet.', image: { src: 'landers/pigtail-pals/pigtail-pals-pink.jpg', alt: 'The pink bag with big eyes, fuzzy brown pigtails and a pink flower' } },
        { pick: 'Purple', title: 'Purple', text: 'Purple tweed with lilac cords, a lilac flower and lilac feet.', image: { src: 'landers/pigtail-pals/pigtail-pals-purple.jpg', alt: 'The purple bag with big eyes, fuzzy brown pigtails, a lilac flower and lilac cords' } },
        { pick: 'Blue', title: 'Blue', text: 'Blue tweed with blue cords, a blue flower and round blue feet.', image: { src: 'landers/pigtail-pals/pigtail-pals-blue.jpg', alt: 'The blue bag with big eyes, fuzzy brown pigtails and a blue flower' } },
        { pick: 'Green', title: 'Green', text: 'Green tweed with dark green cords, a green flower and green feet.', image: { src: 'landers/pigtail-pals/pigtail-pals-green.jpg', alt: 'The green bag with big eyes, fuzzy brown pigtails and a green flower' } },
      ],
      note: 'Can’t choose? Take two or three and mix the colours.',
    },
    uses: {
      h: 'Where she goes',
      items: [
        ['Days out.', 'Phone and keys, hands free.'],
        ['Weekends.', 'At about 140 g, light enough to forget she’s there.'],
        ['Kids.', 'A first bag for coins, sweets and small toys.'],
        ['Gifts.', 'For anyone who likes a bag with a face.'],
      ],
      images: [
        { src: 'products/big-eye-girl-bag/big-eye-girl-bag-04.jpg', alt: 'The blue bag worn crossbody over a black jumper and a white lace skirt' },
        { src: 'products/big-eye-girl-bag/big-eye-girl-bag-03.jpg', alt: 'The green bag worn crossbody over a grey sweatshirt' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, curl by curl.',
      paras: [
        'Hui crochets the tweed body, then the big round eyes, the curly hair and the two pigtails, each tied with a little bow. Last come the flower and the dangling feet.',
        'Because a person makes them, no two heads of hair come out the same.',
      ],
      image: { src: 'products/big-eye-girl-bag/big-eye-girl-bag-07.jpg', alt: 'Hands holding the blue bag up by its cords, showing the eyes, the pigtails and the flower' },
    },
    offer: {
      h: 'Pick your pals',
      lede: 'We suggest two: one for you, and one for a friend or your daughter. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one for a friend',
      notes: { 1: 'Just the one.', 2: 'Any two colours.', 3: 'Any three colours.' },
      defaults: ['Pink', 'Blue', 'Green'],
      proof: friend,
    },
    reviews: [friend, sturdy, maria],
    faq: [
      { q: 'Will my phone fit?', a: 'Most phones fit, with room for lipstick, tissues or keys. She’s 25 cm tall and 15 cm wide at the top.' },
      { q: 'How does it close?', a: 'With a drawstring. Pull the cords and the top gathers shut. The same cords make the 110 cm strap.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay it flat to dry, away from strong sun.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'tassel-and-twine',
    productSlug: 'tassel-crossbody-phone-bag',
    name: 'Tassel & Twine crossbody bag',
    noun: ['bag', 'bags'],
    picks: ['Cream', 'Khaki'],
    maker: 'Hui',
    // Owner, 2026-11-12: the middle ladder, €34.95 / 2 for €59.95 / 3 for €79.95.
    prices: {
      EUR: { 1: 3495, 2: 5995, 3: 7995 },
      GBP: { 1: 2695, 2: 4495, 3: 5795 },
      USD: { 1: 3495, 2: 5995, 3: 7995 },
    },
    title: 'Lined Crochet Crossbody Phone Bag with Tassel | Tassel & Twine',
    description: 'A hand-crocheted crossbody phone bag with a tassel, canvas lining and magnetic snap. Two straps included. Cream or khaki. Free shipping on 2 or more.',
    og: '/go/tassel-and-twine-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'An open crochet bag with a tassel,',
      h1em: 'lined in canvas so nothing falls through.',
      sub: 'Hui crochets the open stitch by hand, then lines it in canvas and adds a magnetic snap. It comes with two straps, woven and faux leather, so you can wear it boho or smart. Cream or khaki.',
      image: { src: 'landers/tassel-and-twine/tassel-and-twine-pair.jpg', alt: 'A khaki and a cream crochet crossbody bag, each with a tassel, wood beads and a brown faux leather strap' },
      proof: maria,
    },
    story: {
      h: 'Pretty stitches, and nothing falls out.',
      paras: [
        'Open crochet looks lovely, but small things can slip through the gaps.',
        'So this one has a canvas lining inside and a magnetic snap at the top. Your phone and cards stay where you put them.',
      ],
      subH: 'Two straps in the box',
      subParas: ['A woven crochet strap for a boho look, and a faux leather strap for something smarter. Each one clips on and off.'],
    },
    fits: {
      h: 'Made for your phone and cards.',
      lede: 'At 20 cm tall and 14.5 cm wide, it holds a phone with room for your cards.',
      specs: [
        ['Size', '20 cm tall, 14.5 cm wide, 1.5 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Straps', 'Two clip-on straps, woven crochet and faux leather. 120 cm.'],
        ['Closes', 'Magnetic snap'],
        ['Inside', 'Canvas lining'],
        ['Weight', 'About 200 g'],
        ['Made from', 'Polyester-acrylic yarn, canvas, faux leather, wood beads'],
        ['Care', 'Hand wash in cool or lukewarm water, below 40°C. Dry flat, out of strong sun.'],
      ],
      image: { src: 'landers/tassel-and-twine/tassel-and-twine-phone.jpg', alt: 'The khaki bag lying above a phone, about the same width, with its tassel and faux leather strap' },
    },
    colours: {
      h: 'Pick your colour',
      lede: 'Two natural shades, each with a matching tassel and wood beads.',
      cards: [
        { pick: 'Cream', title: 'Cream', text: 'Off-white crochet with a cream tassel. Light and summery.', image: { src: 'products/tassel-crossbody-phone-bag/tassel-crossbody-phone-bag-02.jpg', alt: 'The cream bag worn crossbody over a pink shirt and a white dress' } },
        { pick: 'Khaki', title: 'Khaki', text: 'Warm beige crochet with a khaki tassel. Easy with denim and browns.', image: { src: 'products/tassel-crossbody-phone-bag/tassel-crossbody-phone-bag-01.jpg', alt: 'The khaki bag worn crossbody over a white dress and a brown belt' } },
      ],
      note: 'Can’t choose? Get one of each.',
    },
    uses: {
      h: 'Where it goes',
      items: [
        ['Holidays and festivals.', 'Hands free, and light at about 200 g.'],
        ['Weddings and dinners.', 'Clip on the faux leather strap for a smarter look.'],
        ['Errands.', 'Phone and cards, ready to go.'],
        ['Gifts.', 'A boho bag for a friend who loves handmade.'],
      ],
      images: [
        { src: 'products/tassel-crossbody-phone-bag/tassel-crossbody-phone-bag-04.jpg', alt: 'The cream bag worn crossbody on the faux leather strap' },
        { src: 'products/tassel-crossbody-phone-bag/tassel-crossbody-phone-bag-07.jpg', alt: 'The khaki bag worn crossbody over a white dress' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, stitch by stitch.',
      paras: [
        'Hui crochets the open stitch by hand, then sews in the canvas lining, the magnetic snap and the little Hand Made tag. The tassel and wood beads go on last.',
        'Because a person makes each one, no two are exactly alike.',
      ],
      image: { src: 'landers/tassel-and-twine/tassel-and-twine-inside.jpg', alt: 'The cream bag held open, showing the canvas lining and the magnetic snap inside' },
    },
    offer: {
      h: 'Pick your bags',
      lede: 'We suggest two: one in each colour, or one for you and one to give. Two or more ship free, and each bag costs less.',
      flag2: 'One of each',
      notes: { 1: 'Just the one.', 2: 'One of each, or two the same.', 3: 'Any three.' },
      defaults: ['Cream', 'Khaki', 'Cream'],
      proof: friend,
    },
    reviews: [friend, sturdy, asPictured],
    faq: [
      { q: 'Will things fall through the stitches?', a: 'No. There’s a canvas lining inside, and a magnetic snap closes the top.' },
      { q: 'What comes with it?', a: 'Two clip-on straps, one woven crochet and one faux leather, plus the tassel with its wood beads.' },
      { q: 'Will my phone fit?', a: 'Yes. The bag is 20 cm tall and 14.5 cm wide, with room for a phone and your cards.' },
      { q: 'How do I wash it?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay it flat to dry, out of strong sun.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'puppy-pockets',
    productSlug: 'puppy-face-crossbody-bag',
    name: 'Puppy Pockets dog bag',
    noun: ['bag', 'bags'],
    picks: ['Cream', 'Tan'],
    maker: 'Hui',
    // Owner, 2026-11-12: the middle ladder, €34.95 / 2 for €59.95 / 3 for €79.95.
    prices: {
      EUR: { 1: 3495, 2: 5995, 3: 7995 },
      GBP: { 1: 2695, 2: 4495, 3: 5795 },
      USD: { 1: 3495, 2: 5995, 3: 7995 },
    },
    title: 'Crochet Puppy Face Bag with Floppy Ears and Top Handle | Puppy Pockets',
    description: 'A hand-crocheted puppy face bag with floppy ears and odd eyes. Short top handle plus a 100 cm crossbody strap. Cream or tan. Free shipping on 2 or more.',
    og: '/go/puppy-pockets-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'A puppy with floppy ears and odd eyes,',
      h1em: 'on a little bag you carry by the handle or crossbody.',
      sub: 'Hui crochets each puppy by hand, with two eyes in different sizes and ears that flop as you walk. A drawstring closes the top. Carry it by the short handle, or clip on the 100 cm strap. Cream or tan.',
      image: { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-02.jpg', alt: 'A cream puppy face bag with black ears and a tan one with brown ears, held up side by side by their handles' },
      proof: sturdy,
    },
    story: {
      h: 'A face that makes people smile back.',
      paras: [
        'One eye is bigger than the other, the nose is a little round button, and the ears hang down past the bag. That’s the whole charm.',
        'It’s small enough for a child to carry by the handle, and big enough for an adult’s phone and keys.',
      ],
      subH: 'How does it close?',
      subParas: ['With a drawstring under the handle. Pull it to close the top, so there’s no zip to catch on the yarn.'],
    },
    fits: {
      h: 'Room for the everyday.',
      lede: 'Your phone, keys, lip balm, cards, tissues and coins, with space for a child’s small toy or sweets.',
      specs: [
        ['Size', '15 cm tall, 16 cm wide at the top and 17 cm at the base, 2 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Carry', 'By the short top handle, or crossbody on the 100 cm strap'],
        ['Closes', 'Drawstring'],
        ['Made from', 'Polyester yarn'],
        ['Care', 'Hand wash in cool or lukewarm water, 40°C at most. Reshape while damp and dry flat, away from direct sun.'],
      ],
      image: { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-07.jpg', alt: 'The tan puppy bag held open, with a phone and a compact inside' },
    },
    colours: {
      h: 'Pick your pup',
      lede: 'Two puppies, each with ears, handle and nose in a darker shade.',
      cards: [
        { pick: 'Cream', title: 'Cream', text: 'Cream with black ears, a black handle and a black nose.', image: { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-04.jpg', alt: 'The cream puppy bag with black ears, worn crossbody over a grey sweatshirt' } },
        { pick: 'Tan', title: 'Tan', text: 'Tan with dark brown ears, a brown handle and a brown nose.', image: { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-01.jpg', alt: 'The tan puppy bag with brown floppy ears, held by its handle' } },
      ],
      note: 'Can’t choose? Get one of each.',
    },
    uses: {
      h: 'Where it goes',
      items: [
        ['Days out.', 'Phone and keys, hands free on the long strap.'],
        ['Kids.', 'A first bag with a handle that fits little hands.'],
        ['Dog lovers.', 'A birthday present for anyone who stops to pat every dog.'],
        ['Matching.', 'One for you, one for a child, in two colours.'],
      ],
      images: [
        { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-03.jpg', alt: 'The tan puppy bag worn crossbody over a black top' },
        { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-05.jpg', alt: 'The tan puppy bag lying beside a phone, with its long cream strap' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, ears and all.',
      paras: [
        'Hui crochets the body in one colour, then the ears, handle and nose in a darker shade, and sets the two eyes at different sizes.',
        'Because a person makes each one, no two puppies look at you quite the same way.',
      ],
      image: { src: 'products/puppy-face-crossbody-bag/puppy-face-crossbody-bag-10.jpg', alt: 'Close-up of the tan puppy’s odd eyes, round nose and brown ear' },
    },
    offer: {
      h: 'Pick your pups',
      lede: 'We suggest two: one for you and one for a dog lover you know. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one to give',
      notes: { 1: 'Just the one.', 2: 'One of each, or two the same.', 3: 'Any three.' },
      defaults: ['Cream', 'Tan', 'Cream'],
      proof: friend,
    },
    reviews: [friend, maria, asPictured],
    faq: [
      { q: 'What fits inside?', a: 'A phone, keys, lip balm, cards, tissues and coins, with room for a child’s small toy or sweets.' },
      { q: 'How do I carry it?', a: 'By the short top handle, or crossbody on the 100 cm strap.' },
      { q: 'How does it close?', a: 'With a drawstring under the handle. Pull it to close the top.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in cool or lukewarm water, 40°C at most. Reshape while damp and dry flat, away from direct sun.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'stretch-dogs',
    productSlug: 'dog-crossbody-purse',
    name: 'Stretch Dogs crossbody bag',
    noun: ['dog', 'dogs'],
    picks: ['Khaki', 'Yellow'],
    maker: 'Hui',
    // Owner, 2026-11-12: the middle ladder, €34.95 / 2 for €59.95 / 3 for €79.95.
    prices: {
      EUR: { 1: 3495, 2: 5995, 3: 7995 },
      GBP: { 1: 2695, 2: 4495, 3: 5795 },
      USD: { 1: 3495, 2: 5995, 3: 7995 },
    },
    title: 'Crochet Long Dog Crossbody Bag, Chunky and Squishy | Stretch Dogs',
    description: 'A hand-crocheted long dog crossbody bag, 34 cm nose to tail, chunky and squishy, on a 130 cm strap. Khaki or yellow. Free shipping on 2 or more.',
    og: '/go/stretch-dogs-og.jpg',
    bar: 'Free shipping on 2 dogs or more',
    hero: {
      h1: 'A long, squishy crochet dog,',
      h1em: 'that carries your phone, keys and lipstick.',
      sub: 'Hui crochets him in a chunky, pillowy stitch, 34 cm from nose to tail, with floppy ears and four round feet. He hangs at your side on a 130 cm strap. Khaki or yellow.',
      image: { src: 'products/dog-crossbody-purse/dog-crossbody-purse-01.jpg', alt: 'A yellow and a khaki long crochet dog bag lying side by side on a bed with their braided straps' },
      proof: sturdy,
    },
    story: {
      h: 'Soft enough to squeeze.',
      paras: [
        'The chunky stitch makes him feel more like a soft toy than a bag. He has floppy ears, a short tail and four round feet that stick out underneath.',
        'He’s long rather than deep, so he lies flat against you and still holds the everyday things.',
      ],
      subH: 'How heavy is he?',
      subParas: ['About 160 g, so you’ll hardly notice him on your shoulder.'],
    },
    fits: {
      h: 'A real everyday bag.',
      lede: 'A phone, lipstick, tissues, keys and a bus card all fit inside.',
      specs: [
        ['Size', '34 cm long, 15 cm tall, 2 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Strap', '130 cm braided strap, worn crossbody or over the shoulder'],
        ['Weight', 'About 160 g'],
        ['Made from', 'Polyester-acrylic yarn'],
        ['Care', 'Hand wash in room-temperature or lukewarm water, below 40°C. Dry flat.'],
      ],
      image: { src: 'products/dog-crossbody-purse/dog-crossbody-purse-09.jpg', alt: 'The yellow dog bag lying on a bed beside a phone, with its yellow braided strap' },
    },
    colours: {
      h: 'Pick your dog',
      lede: 'Two dogs, each with ears and a tail in a darker shade.',
      cards: [
        { pick: 'Khaki', title: 'Khaki', text: 'Warm khaki with dark brown ears and tail, on a brown strap.', image: { src: 'products/dog-crossbody-purse/dog-crossbody-purse-02.jpg', alt: 'The khaki dog bag with dark brown ears, held against a polka-dot shirt' } },
        { pick: 'Yellow', title: 'Yellow', text: 'Sunny yellow with black ears and tail, on a yellow strap.', image: { src: 'products/dog-crossbody-purse/dog-crossbody-purse-03.jpg', alt: 'The yellow dog bag with black ears, worn crossbody over a white skirt' } },
      ],
      note: 'Can’t choose? Get one of each.',
    },
    uses: {
      h: 'Where he goes',
      items: [
        ['Every day.', 'Phone, keys and lipstick, hands free.'],
        ['Kids.', 'A first bag for coins, small toys and treats.'],
        ['Dog lovers.', 'For anyone who has a long dog, or wants one.'],
        ['Matching.', 'One khaki, one yellow, for you and a friend.'],
      ],
      images: [
        { src: 'products/dog-crossbody-purse/dog-crossbody-purse-04.jpg', alt: 'The khaki dog bag worn crossbody over a white shirt' },
        { src: 'products/dog-crossbody-purse/dog-crossbody-purse-08.jpg', alt: 'The yellow dog bag lying on a bed with its braided strap' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, nose to tail.',
      paras: [
        'Hui crochets the long body in a chunky stitch, then the head, the floppy ears, the four round feet and the tail.',
        'Because a person makes each one, no two dogs come out exactly alike.',
      ],
      image: { src: 'products/dog-crossbody-purse/dog-crossbody-purse-05.jpg', alt: 'The khaki dog bag worn at the hip, showing his ears, feet and tail' },
    },
    offer: {
      h: 'Pick your dogs',
      lede: 'We suggest two: one for you and one for a dog lover you know. Two or more ship free, and each dog costs less.',
      flag2: 'One for you, one to give',
      notes: { 1: 'Just the one.', 2: 'One of each, or two the same.', 3: 'Any three.' },
      defaults: ['Khaki', 'Yellow', 'Khaki'],
      proof: friend,
    },
    reviews: [friend, secondBuy, maria],
    faq: [
      { q: 'What fits inside?', a: 'A phone, lipstick, tissues, keys and a bus card.' },
      { q: 'How long is the strap?', a: '130 cm, long enough to wear crossbody or over the shoulder.' },
      kidsFaq('dog'),
      { q: 'How do I wash it?', a: 'Hand wash in room-temperature or lukewarm water, below 40°C, and lay it flat to dry.' },
      arriveFaq('dog'),
      returnsFaq,
    ],
  },
  {
    slug: 'bamboo-buddies',
    productSlug: 'panda-crossbody-bag',
    name: 'Bamboo Buddies panda bag',
    noun: ['panda', 'pandas'],
    picks: ['Mini Tote Bag', 'Crossbody Sling Bag'],
    maker: 'Hui',
    // Owner, 2026-11-12: pick a style, or both. Mini tote €34.95, sling €37.95 (the listing
    // prices); both pandas €59.95, shipping free.
    sizes: {
      1: { option: 'Mini tote', label: 'Mini tote', pieces: 1, pick: 'Mini Tote Bag' },
      2: { option: 'Tall sling', label: 'Tall sling', pieces: 1, pick: 'Crossbody Sling Bag' },
      3: { option: 'Set: 1 mini tote + 1 tall sling', label: 'Both pandas', pieces: 2 },
    },
    sizesWord: 'styles',
    prices: {
      EUR: { 1: 3495, 2: 3795, 3: 5995 },
      GBP: { 1: 2695, 2: 2895, 3: 4495 },
      USD: { 1: 3495, 2: 3795, 3: 5995 },
    },
    title: 'Crochet Panda Bag: Mini Tote or Tall Sling | Bamboo Buddies',
    description: 'A hand-crocheted grumpy panda bag in two styles: a mini tote with a short handle, or a tall sling with dangling legs. Get both and shipping is free.',
    og: '/go/bamboo-buddies-og.jpg',
    bar: 'Free shipping when you get both pandas',
    hero: {
      h1: 'A grumpy little crochet panda,',
      h1em: 'in a mini tote or a tall sling for your phone.',
      sub: 'Hui crochets each panda in black and white, with big eye patches, round ears and red blush marks. Pick the mini tote with its short handle, the tall sling with dangling legs, or both.',
      image: { src: 'products/panda-crossbody-bag/panda-crossbody-bag-03.jpg', alt: 'The panda mini tote with its black handle beside the tall panda sling with dangling arms and legs' },
      proof: asPictured,
    },
    story: {
      h: 'Unimpressed, and somehow adorable.',
      paras: [
        'Two big black eye patches, a little stitched frown and red blush on the cheeks give every panda the same unimpressed look.',
        'Hui stitches the blush marks on one by one, so no two pandas match exactly.',
      ],
      subH: 'Which style?',
      subParas: ['The mini tote is a wide panda face with a short handle, on a 112 cm strap. The tall sling is a whole panda with dangling arms and legs, on a 120 cm strap.'],
    },
    fits: {
      h: 'Two styles, both made for your phone.',
      lede: 'Each holds a phone, cards, keys and lip balm, and maybe a small wallet.',
      specs: [
        ['Mini tote', '14 cm tall, 18 cm wide at the base and 13 cm at the top, 2 cm deep, on a 112 cm strap.'],
        ['Tall sling', '26 cm tall, 12 cm wide, 3 cm deep, on a 120 cm strap.'],
        ['Sizing', 'Measured by hand, so allow 2 to 3 cm.'],
        ['Weight', 'About 130 to 140 g'],
        ['Made from', 'Polyester yarn'],
        ['Care', 'Hand wash in cool water with mild soap and dry flat. Wash it on its own the first time, as the black yarn can bleed a little.'],
      ],
      image: { src: 'products/panda-crossbody-bag/panda-crossbody-bag-10.jpg', alt: 'The panda mini tote lying beside a phone, with its black strap' },
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Every day.', 'Phone, cards and keys, hands free.'],
        ['Matching.', 'The tote for you, the sling for a friend, or the other way round.'],
        ['Panda lovers.', 'A birthday present that makes them laugh.'],
        ['Kids.', 'Fair warning: they will try to claim it.'],
      ],
      images: [
        { src: 'products/panda-crossbody-bag/panda-crossbody-bag-04.jpg', alt: 'The panda mini tote worn crossbody over a grey cable-knit jumper' },
        { src: 'products/panda-crossbody-bag/panda-crossbody-bag-02.jpg', alt: 'The tall panda sling worn crossbody over a grey cable-knit jumper' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, frown and all.',
      paras: [
        'Hui crochets the white body, the black ears and eye patches, and for the sling the arms and legs. Then she stitches the frown and the red blush.',
        'Because a person makes each one, no two pandas look quite the same.',
      ],
      image: { src: 'products/panda-crossbody-bag/panda-crossbody-bag-08.jpg', alt: 'The tall panda sling worn at the front, showing its eye patches, blush and black feet' },
    },
    offer: {
      h: 'Pick your panda',
      lede: 'One panda, or both styles together. The pair ships free, and costs less than buying the two.',
      flag2: 'Both styles',
      notes: { 1: 'Short handle, wide face.', 2: 'Tall, with dangling legs.', 3: 'One mini tote and one tall sling.' },
      defaults: ['Mini Tote Bag', 'Mini Tote Bag', 'Mini Tote Bag'],
      proof: friend,
    },
    reviews: [friend, sturdy, maria],
    faq: [
      { q: 'What’s the difference between the two styles?', a: 'The mini tote is a wide panda face with a short handle, on a 112 cm strap. The tall sling is a whole panda with dangling arms and legs, on a 120 cm strap.' },
      { q: 'What fits inside?', a: 'A phone, cards, keys and lip balm, and maybe a small wallet. It’s not big enough for A4 paper or a tablet.' },
      { q: 'What’s in the set?', a: 'One mini tote and one tall sling. The set ships free.' },
      { q: 'How do I wash it?', a: 'Hand wash in cool water with mild soap and lay it flat to dry. Wash it on its own the first time, as the black yarn can bleed a little.' },
      arriveFaq('panda'),
      returnsFaq,
    ],
  },
  {
    slug: 'potted-roses',
    productSlug: 'rose-flower-coaster-with-mini-basket',
    name: 'Potted Roses coasters',
    noun: ['pair', 'pairs'],
    picks: ['Yellow', 'Purple', 'Pink', 'Red', 'White', 'Blue'],
    per: 2,
    maker: 'Hui',
    shop: ['/shop/coasters/', 'Coasters'],
    // Owner, 2026-11-12: sets of 2 / 4 / 6 at €29.95 / €49.95 / €69.95, each pair in one colour.
    prices: {
      EUR: { 1: 2995, 2: 4995, 3: 6995 },
      GBP: { 1: 2595, 2: 4195, 3: 5895 },
      USD: { 1: 2995, 2: 4995, 3: 6995 },
    },
    title: 'Crochet Rose Coasters That Fold Into a Mini Basket | Potted Roses',
    description: 'Hand-crocheted rose coasters, 16 cm across, each with its own mini basket to fold into. Six colours, sets of 2, 4 or 6. Free shipping on 4 or more.',
    og: '/go/potted-roses-og.jpg',
    bar: 'Free shipping on sets of 4 or more',
    hero: {
      h1: 'Twelve crochet roses around a coaster,',
      h1em: 'that folds into its own little flower pot.',
      sub: 'Hui crochets twelve tiny roses with green leaves around a soft white coaster, 16 cm across. When you’re not using it, fold it up and tuck it into its mini basket, and it sits on the shelf like a pot of roses.',
      image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-03.jpg', alt: 'Six crochet rose coasters folded into their mini baskets like little pots of roses, in blue, white, red, yellow, pink and purple' },
      proof: sturdy,
    },
    story: {
      h: 'A coaster that doesn’t hide in a drawer.',
      paras: [
        'Under a mug, it’s a ring of roses that keeps hot cups and cold glasses off the table.',
        'Between cups, it folds into its basket and becomes a little pot of roses on the shelf. Every coaster comes with its own basket.',
      ],
      subH: 'How many roses?',
      subParas: ['Twelve on every coaster, each about 3 cm across, with tiny green leaves between them.'],
    },
    fits: {
      h: 'Room for a big mug.',
      lede: 'Each coaster is 16 cm across, with a soft white centre where your mug or glass sits.',
      specs: [
        ['Coaster', '16 cm across, with twelve roses about 3 cm each'],
        ['Basket', '7 cm wide and 6 cm tall, one with every coaster'],
        ['Weight', 'About 40 g each'],
        ['Made from', 'Acrylic yarn'],
        ['Sizing', 'Made by hand, so allow 1 to 2 cm.'],
        ['Care', 'Hand wash in cool or lukewarm water, below 40°C. Dry flat, out of direct sun.'],
      ],
      image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-04.jpg', alt: 'A yellow rose coaster lying flat, with twelve roses around its white centre' },
    },
    colours: {
      h: 'Pick your colours',
      lede: 'Six colours. Each pair comes in one colour, so a set of six can be three different colours.',
      cards: [
        { pick: 'Yellow', title: 'Yellow', text: 'Sunny yellow roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-04.jpg', alt: 'The yellow rose coaster' } },
        { pick: 'Purple', title: 'Purple', text: 'Soft lilac roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-06.jpg', alt: 'The purple rose coaster' } },
        { pick: 'Pink', title: 'Pink', text: 'Pale pink roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-07.jpg', alt: 'The pink rose coaster' } },
        { pick: 'Red', title: 'Red', text: 'Classic red roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-05.jpg', alt: 'The red rose coaster' } },
        { pick: 'White', title: 'White', text: 'All-white roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-08.jpg', alt: 'The white rose coaster' } },
        { pick: 'Blue', title: 'Blue', text: 'Bright blue roses.', image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-09.jpg', alt: 'The blue rose coaster' } },
      ],
      note: 'Getting four or six? Mix the colours however you like.',
    },
    uses: {
      h: 'Where they go',
      items: [
        ['Morning coffee.', 'Your mug sits inside a ring of roses.'],
        ['Shelves.', 'Folded into their baskets, they look like little potted roses.'],
        ['Birthdays.', 'A gift that looks like flowers and gets used every day.'],
        ['Housewarmings.', 'Six coasters, six baskets, for a new kitchen.'],
      ],
      images: [
        { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-01.jpg', alt: 'Six rose coasters lying flat in yellow, white, purple, blue, red and pink' },
        { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-10.jpg', alt: 'Six rose coasters stacked in a rainbow of colours' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, rose by rose.',
      paras: [
        'Hui crochets the white centre, then twelve tiny roses and the leaves between them, and a basket to match.',
        'Because a person makes them, no two roses curl quite the same way.',
      ],
      image: { src: 'products/rose-flower-coaster-with-mini-basket/rose-flower-coaster-with-mini-basket-07.jpg', alt: 'Close-up of the pink rose coaster, with its roses and green leaves' },
    },
    offer: {
      h: 'Pick your roses',
      lede: 'We suggest four: two to keep and two to give. Sets of four or six ship free, and each coaster costs less.',
      flag2: 'Two to keep, two to give',
      notes: { 1: 'One pair.', 2: 'Any two pairs.', 3: 'Any three pairs.' },
      defaults: ['Pink', 'Yellow', 'Purple'],
      proof: friend,
    },
    reviews: [friend, maria, asPictured],
    faq: [
      { q: 'What’s the basket for?', a: 'Fold the coaster up and tuck it inside, and it sits on the shelf like a little pot of roses. Every coaster comes with its own basket.' },
      { q: 'Will my mug fit?', a: 'Yes. Each coaster is 16 cm across, with a soft white centre for your mug or glass.' },
      { q: 'What’s in a set?', a: 'Sets come in pairs: two, four or six coasters, each with its basket. Pick a colour for each pair. Sets of four or six ship free.' },
      { q: 'How do I wash them?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay them flat to dry, out of direct sun.' },
      arriveFaq('coasters'),
      returnsFaq,
    ],
  },
  {
    slug: 'mandala-blooms',
    productSlug: 'flower-mandala-coaster',
    name: 'Mandala Blooms coasters',
    noun: ['coaster', 'coasters'],
    picks: ['4 coasters + free basket', '6 coasters + free basket', '8 coasters + 2 free baskets'],
    maker: 'Hui',
    shop: ['/shop/coasters/', 'Coasters'],
    // Owner, 2026-11-12: the listing's packs, 4 / 6 / 8 at €24.95 / €34.95 / €44.95, colours
    // mixed by Hui. The 4-pack pays shipping; 6 and 8 ship free.
    sizes: {
      1: { option: '4 coasters + 1 basket', label: 'Pack of 4', pieces: 4, pick: '4 coasters + free basket', free: false },
      2: { option: '6 coasters + 1 basket', label: 'Pack of 6', pieces: 6, pick: '6 coasters + free basket', free: true },
      3: { option: '8 coasters + 2 baskets', label: 'Pack of 8', pieces: 8, pick: '8 coasters + 2 free baskets', free: true },
    },
    sizesKind: 'packs',
    prices: {
      EUR: { 1: 2495, 2: 3495, 3: 4495 },
      GBP: { 1: 2195, 2: 2995, 3: 3795 },
      USD: { 1: 2495, 2: 3495, 3: 4495 },
    },
    title: 'Crochet Flower Mandala Coasters with Mini Basket | Mandala Blooms',
    description: 'Hand-crocheted flower mandala coasters in a mix of colours, with a free mini basket. Packs of 4, 6 or 8. Free shipping on 6 or more.',
    og: '/go/mandala-blooms-og.jpg',
    bar: 'Free shipping on packs of 6 or 8',
    hero: {
      h1: 'Crochet flower mandala coasters,',
      h1em: 'in a mix of colours, with a basket to keep them in.',
      sub: 'Hui crochets each coaster in a sunburst of white petals and tiny green leaves, with a scalloped edge in a bright colour. Every pack comes in a mix of colours, with a free crochet basket.',
      image: { src: 'products/flower-mandala-coaster/flower-mandala-coaster-01.jpg', alt: 'Eight crochet flower mandala coasters in yellow, purple, red, pink and blue, around a brown crochet basket' },
      proof: sturdy,
    },
    story: {
      h: 'Pretty enough to leave out.',
      paras: [
        'Each one is a little flower mandala: a soft centre, a ring of white petals with green leaves, and a ruffled edge in yellow, purple, pink, red or an ombre shade.',
        'Every pack comes in a mix of colours chosen by Hui, so the table looks like a bunch of flowers.',
      ],
      subH: 'What’s the basket for?',
      subParas: ['Stack the coasters inside it between cups, so they stay together and tidy. The 8-pack comes with two.'],
    },
    fits: {
      h: 'Made for mugs and glasses.',
      lede: 'The soft stitch grips the table, so a heavy mug sits steady, and it soaks up drips before they reach the wood.',
      specs: [
        ['Packs', '4 coasters and a basket, 6 and a basket, or 8 and two baskets'],
        ['Colours', 'A mix from yellow, purple, pink, red and ombre shades, chosen by Hui'],
        ['Made from', 'Polyester yarn'],
        ['Size', 'About 14 cm across. Hooked by hand, one at a time, so small size differences are part of the look'],
        ['Care', 'Hand wash gently in cool or lukewarm water, below 40°C. Press the water out in a towel and dry flat, away from direct sun.'],
      ],
      image: { src: 'products/flower-mandala-coaster/flower-mandala-coaster-05.jpg', alt: 'A glass tumbler sitting on a purple flower mandala coaster' },
    },
    uses: {
      h: 'Where they go',
      items: [
        ['The kitchen table.', 'A coaster for everyone, in different colours.'],
        ['The nightstand.', 'For a glass of water, or your rings and earrings.'],
        ['The desk.', 'Tea next to the laptop, and no rings on the wood.'],
        ['Under a candle or a plant pot.', 'They work as little doilies too.'],
      ],
      images: [
        { src: 'products/flower-mandala-coaster/flower-mandala-coaster-02.jpg', alt: 'Pink, red, purple and yellow flower mandala coasters on a dark tray' },
        { src: 'products/flower-mandala-coaster/flower-mandala-coaster-03.jpg', alt: 'Purple, blue, yellow and pink ombre flower mandala coasters on a dark tray' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, one at a time.',
      paras: [
        'Hui hooks each coaster from the centre out: the soft middle, the white petals, the tiny green leaves, then the scalloped edge.',
        'Because a person makes them, small differences in size and colour are part of the look.',
      ],
      image: { src: 'products/flower-mandala-coaster/flower-mandala-coaster-04.jpg', alt: 'A stack of flower mandala coasters with a brown crochet basket on top' },
    },
    offer: {
      h: 'Pick your pack',
      lede: 'We suggest six: enough for the table, with a basket to keep them together. Packs of six or eight ship free.',
      flag2: 'Enough for the table',
      notes: { 1: '4 coasters and a basket.', 2: '6 coasters and a basket.', 3: '8 coasters and 2 baskets.' },
      defaults: ['6 coasters + free basket', '6 coasters + free basket', '6 coasters + free basket'],
      proof: friend,
    },
    reviews: [friend, maria, asPictured],
    faq: [
      { q: 'What comes in each pack?', a: 'Four coasters and a mini basket, six and a basket, or eight and two baskets.' },
      { q: 'Can I choose the colours?', a: 'Each pack comes in a mix of colours chosen by Hui, from yellow, purple, pink, red and the ombre shades.' },
      { q: 'What else can I use them for?', a: 'They work as little doilies under a candle or a small plant pot, or for your rings and earrings at night.' },
      { q: 'How do I wash them?', a: 'Hand wash gently in cool or lukewarm water, below 40°C. Press the water out in a towel and lay them flat to dry, away from direct sun.' },
      arriveFaq('coasters'),
      returnsFaq,
    ],
  },
  {
    slug: 'fuzzy-pups',
    productSlug: 'fluffy-dog-crossbody-bag',
    name: 'Fuzzy Pups dog bag',
    noun: ['bag', 'bags'],
    picks: ['Brown', 'Beige', 'Blue'],
    maker: 'Hui',
    // Owner, 2026-11-12: the middle ladder, €34.95 / 2 for €59.95 / 3 for €79.95.
    prices: {
      EUR: { 1: 3495, 2: 5995, 3: 7995 },
      GBP: { 1: 2695, 2: 4495, 3: 5795 },
      USD: { 1: 3495, 2: 5995, 3: 7995 },
    },
    title: 'Fluffy Crochet Puppy Crossbody Bag with Big Nose | Fuzzy Pups',
    description: 'A hand-crocheted fluffy puppy crossbody bag with floppy ears and a big black nose. Fits a 6.5 inch phone. Brown, beige or blue. Free shipping on 2 or more.',
    og: '/go/fuzzy-pups-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'A fuzzy crochet puppy with a big black nose,',
      h1em: 'that carries your phone and your cards.',
      sub: 'Hui crochets each puppy in a soft loop-stitch fur, with floppy ears, little black eyes and a big fluffy nose. It hangs on an adjustable brown faux leather strap. Brown, beige or blue.',
      image: { src: 'landers/fuzzy-pups/fuzzy-pups-group.jpg', alt: 'Three fluffy crochet puppy bags on a wooden shelf, in beige, brown and blue, each with a big black nose and floppy ears' },
      proof: sturdy,
    },
    story: {
      h: 'Soft as a teddy, and still a proper bag.',
      paras: [
        'The loop stitch makes a dense, curly fur that feels like a teddy bear and keeps its shape day after day.',
        'Two floppy ears, two little eyes and one big fluffy nose. That’s the whole face, and it’s enough.',
      ],
      subH: 'How heavy is it?',
      subParas: ['About 110 g, so you’ll forget you’re wearing it.'],
    },
    fits: {
      h: 'Room for your phone and a few small things.',
      lede: 'Phones up to 6.5 inches fit, with room for a cardholder, a small notebook or a travel-size bottle.',
      specs: [
        ['Size', '18 cm tall, 13 cm wide, 3 cm deep. Measured by hand, so allow 1 to 3 cm.'],
        ['Strap', '120 cm brown faux leather, adjusted with a knot at the metal ring'],
        ['Weight', 'About 110 g'],
        ['Made from', 'Polyester loop-stitch yarn, black safety eyes'],
        ['Care', 'Hand wash only, in cool water below 40°C. Wash it on its own and dry flat.'],
      ],
      image: { src: 'landers/fuzzy-pups/fuzzy-pups-phone.jpg', alt: 'The brown puppy bag with a phone, a compact and a small tube poking out of the top' },
    },
    colours: {
      h: 'Pick your pup',
      lede: 'Three colours, each with the same big black nose and brown strap.',
      cards: [
        { pick: 'Brown', title: 'Brown', text: 'Warm caramel brown, like a golden retriever.', image: { src: 'landers/fuzzy-pups/fuzzy-pups-brown.jpg', alt: 'The brown fluffy puppy bag on its brown strap' } },
        { pick: 'Beige', title: 'Beige', text: 'Soft cream beige. Bright against a dark coat.', image: { src: 'landers/fuzzy-pups/fuzzy-pups-beige.jpg', alt: 'The beige fluffy puppy bag on its brown strap' } },
        { pick: 'Blue', title: 'Blue', text: 'A soft lavender blue. The one people ask about.', image: { src: 'landers/fuzzy-pups/fuzzy-pups-blue.jpg', alt: 'The blue fluffy puppy bag on its brown strap' } },
      ],
      note: 'Can’t choose? Take two or three and mix the colours.',
    },
    uses: {
      h: 'Where it goes',
      items: [
        ['Every day.', 'Phone and cards, hands free.'],
        ['Winter coats.', 'Fluffy fur that looks right with knits and wool.'],
        ['Dog lovers.', 'A present for anyone who stops to pat every dog.'],
        ['Matching.', 'Two colours, for you and a friend.'],
      ],
      images: [
        { src: 'landers/fuzzy-pups/fuzzy-pups-beige-worn.jpg', alt: 'The beige puppy bag worn on the shoulder over a black hoodie and jeans' },
        { src: 'landers/fuzzy-pups/fuzzy-pups-blue-worn.jpg', alt: 'The blue puppy bag worn crossbody over a black jumper and a white lace skirt' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, curl by curl.',
      paras: [
        'Hui crochets the body in a dense loop stitch, then the two floppy ears and the big round nose, and sets in the little black eyes.',
        'Because a person makes each one, no two puppies come out exactly alike.',
      ],
      image: { src: 'landers/fuzzy-pups/fuzzy-pups-brown-close.jpg', alt: 'Close-up of the brown puppy bag, showing the curly loop-stitch fur, the floppy ears and the big black nose' },
    },
    offer: {
      h: 'Pick your pups',
      lede: 'We suggest two: one for you and one for a dog lover you know. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one to give',
      notes: { 1: 'Just the one.', 2: 'Any two colours.', 3: 'Any three colours.' },
      defaults: ['Brown', 'Beige', 'Blue'],
      proof: friend,
    },
    reviews: [friend, maria, asPictured],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes, phones up to 6.5 inches, with room for a cardholder, a small notebook or a travel-size bottle.' },
      { q: 'Can I adjust the strap?', a: 'Yes. The 120 cm brown faux leather strap adjusts with a knot at the metal ring. Wear it short on one shoulder, or long across the body.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash only, in cool water below 40°C. Wash it on its own the first time, and lay it flat to dry.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
  {
    slug: 'petal-pockets',
    productSlug: '3d-flower-crochet-phone-bag',
    name: 'Petal Pockets flower phone bag',
    noun: ['bag', 'bags'],
    picks: ['Rose', 'Sunflower'],
    maker: 'Hui',
    // Owner, 2026-11-13: the middle ladder, €34.95 / 2 for €59.95 / 3 for €79.95.
    prices: {
      EUR: { 1: 3495, 2: 5995, 3: 7995 },
      GBP: { 1: 2695, 2: 4495, 3: 5795 },
      USD: { 1: 3495, 2: 5995, 3: 7995 },
    },
    title: 'Crochet Phone Bag with a 3D Rose or Sunflower | Petal Pockets',
    description: 'A hand-crocheted phone bag with a sculpted 3D rose or sunflower on the front. Fits phones up to 6.5 inches, drawstring top, 110 cm strap. Free shipping on 2 or more.',
    og: '/go/petal-pockets-og.jpg',
    bar: 'Free shipping on 2 bags or more',
    hero: {
      h1: 'A crochet phone bag with a 3D rose or sunflower,',
      h1em: 'that carries your phone, cards and keys.',
      sub: 'Hui coils the rose petal by petal in soft pink, or layers the sunflower in rounds of yellow around a brown centre, then stitches it onto a cream bag with a green stem and leaves. A drawstring closes the top, and the strap is 110 cm.',
      image: { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-01.jpg', alt: 'Two cream crochet phone bags side by side, one with a yellow 3D sunflower and one with a pink 3D rose, each on a green stem' },
      proof: { reviewer: 'Caitlin', date: '2026-02-13' },
    },
    story: {
      h: 'Flowers you can wear every day.',
      paras: [
        'Most flower bags have a flat patch sewn on. On these, the flower stands out from the bag: a rose you could almost pick, or a sunflower with petals you can feel.',
        'Underneath, it’s a practical phone bag. It hangs across your body, weighs about 80 g, and pulls shut with a drawstring, so your phone and cards stay put.',
      ],
      subH: 'Rose or sunflower?',
      subParas: ['The rose is soft pink with spiralling, coiled petals. The sunflower is bright yellow with layered petals and a brown centre. Both sit on the same cream bag, with a stem and two green leaves.'],
    },
    fits: {
      h: 'Room for your phone and the small things.',
      lede: 'Phones up to 6.5 inches fit, with room for a flat cardholder, keys, lip balm and earbuds.',
      specs: [
        ['Size', '12 cm wide, 18 cm tall, 1 cm deep. Each flower is shaped by hand, so allow 1 to 3 cm.'],
        ['Holds', 'Phones up to 6.5 inches, plus a cardholder, keys, lip balm and earbuds'],
        ['Closes', 'Drawstring: pull to close, loosen to reach in'],
        ['Strap', '110 cm, adjustable, with a lobster clasp. Crossbody or on the shoulder.'],
        ['Weight', 'About 80 g'],
        ['Made from', 'Polyester-acrylic yarn'],
        ['Care', 'Hand wash or gentle machine wash in cool water below 40°C, separately from dark colours. Dry flat, no tumble dryer.'],
      ],
      image: { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-09.jpg', alt: 'The sunflower bag with a phone in its case slipping in at the top, beside the braided strap' },
    },
    colours: {
      h: 'Pick your flower',
      lede: 'Same bag, two flowers. Mix them in a bundle however you like.',
      cards: [
        { pick: 'Rose', title: 'Rose', text: 'A soft pink rose with spiralling, coiled petals, on a green stem with two leaves.', image: { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-02.jpg', alt: 'Cream crochet phone bag with a large pink 3D rose and green leaves' } },
        { pick: 'Sunflower', title: 'Sunflower', text: 'A bright yellow sunflower with layered petals and a brown centre, on a brown stem with two leaves.', image: { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-03.jpg', alt: 'Cream crochet phone bag with a large yellow 3D sunflower and stem' } },
      ],
      note: 'Can’t choose? Take two and get one of each.',
    },
    uses: {
      h: 'Where it goes',
      items: [
        ['Every day.', 'Phone, cards and keys, with your hands free.'],
        ['Spring and summer days out.', 'A flower that goes with a white skirt or a sundress.'],
        ['Mother’s Day.', 'A rose that lasts longer than a bunch from the shop.'],
        ['Gifts.', 'For a friend who loves flowers, or one who loves sunflowers in particular.'],
      ],
      images: [
        { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-04.jpg', alt: 'The rose bag worn crossbody over a grey sweatshirt' },
        { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-06.jpg', alt: 'The sunflower bag worn crossbody over a black top and a white skirt' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, petal by petal.',
      paras: [
        'Hui crochets the cream bag first, then builds the flower on its own: the rose coiled petal by petal, or the sunflower in layered rounds around its centre. Last come the stem and the two leaves.',
        'Because a person shapes each flower, no two come out exactly alike.',
      ],
      image: { src: 'products/3d-flower-crochet-phone-bag/3d-flower-crochet-phone-bag-08.jpg', alt: 'A hand holding the sunflower bag up close, showing the layered yellow petals and brown centre' },
    },
    offer: {
      h: 'Pick your bags',
      lede: 'We suggest two: one rose and one sunflower, or one for you and one to give. Two or more ship free, and each bag costs less.',
      flag2: 'One of each',
      notes: { 1: 'Just the one.', 2: 'A rose and a sunflower, or two the same.', 3: 'Any three.' },
      defaults: ['Rose', 'Sunflower', 'Rose'],
      proof: friend,
    },
    reviews: [{ reviewer: 'Caitlin', date: '2026-02-13' }, sturdy, maria],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes, phones up to 6.5 inches, with room for a cardholder, keys, lip balm and earbuds.' },
      { q: 'How does it close?', a: 'With a drawstring at the top. Pull it to close, loosen it to reach in.' },
      { q: 'Can I wear it on the shoulder?', a: 'Yes. The 110 cm strap adjusts and clips on with a lobster clasp, so you can wear it crossbody or on one shoulder.' },
      { q: 'How do I wash it?', a: 'Hand wash or use a gentle machine cycle in cool water below 40°C, separately from dark colours. Lay it flat to dry, and don’t tumble dry.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
];

export const landerBySlug = (slug: string) => LANDERS.find((l) => l.slug === slug);
