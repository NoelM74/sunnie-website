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
  a: `Hui makes your ${noun} to order, and it ships within 3–5 days with tracking. Delivery times for every country are on the <a href="/shipping/">shipping page</a>. There’s nothing extra to pay on delivery in the EU, UK or US.`,
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
      image: { src: 'landers/finn-the-shamrock/finn-frog-bag-phone-closeup-1400.webp', alt: 'A hand dropping a phone in a cream case into the yellow mouth of Finn, a green crocheted frog bag in dungarees' },
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
      image: { src: 'landers/finn-the-shamrock/finn-frog-bag-held-front-900.webp', alt: 'Finn the frog bag held out in front, a phone tucked in his yellow mouth, showing his dungarees, shamrock and long legs' },
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
      image: { src: 'landers/finn-the-shamrock/finn-frog-bag-worn-crossbody-900.webp', alt: 'Finn the frog bag worn across the body on a green crocheted strap, with long dangling arms and legs and a shamrock on his dungarees' },
    },
    offer: {
      h: 'Pick your frogs',
      lede: 'We suggest two: one to keep, and one for the friend who will ask where you got yours. Two or more ship free, and each frog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'One to keep, one to give.', 3: 'Three gifts sorted in one order.' },
      defaults: ['Green', 'Green', 'Green'],
      proof: { reviewer: 'Hannah', date: '2026-06-04' },
    },
    reviews: [
      { reviewer: 'hexfeather', date: '2026-09-25' },
      { reviewer: 'Hannah', date: '2026-06-04' },
      { reviewer: 'Sandra', date: '2026-05-21' },
      { reviewer: 'Nelly', date: '2026-04-17' },
    ],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. The photos show a large phone in a thick case going in through his mouth, and one buyer carries her phone and a 6-inch Kindle. A tablet, laptop or water bottle won’t fit.' },
      { q: 'Is he a bag or a toy?', a: 'A bag, made for teens and adults, with two straps and gold-tone metal clasps. He’s not for under-3s: the buttons and the faux pearl are small parts.' },
      { q: 'Which strap should I use?', a: 'He comes with both. The green crocheted strap matches his body. The 120 cm strap adjusts, so you can wear him on your hip or across your front. Unclip either one to carry him by hand.' },
      { q: 'Does the mouth close?', a: 'No. It has no zip, clasp or magnet, so you reach straight in from the top. On a crowded train, wear him across your front.' },
      { q: 'How do I wash him?', a: 'Hand wash in cool or warm water, up to 40°C. Lay him flat to dry, and keep him out of strong sun for long periods.' },
      { q: 'When will it arrive?', a: 'We post within four working days, and refund your postage if we miss that. Delivery times for every country are on the <a href="/shipping/">shipping page</a>. There’s nothing extra to pay on delivery in the EU, UK or US.' },
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
      image: { src: 'landers/finn-in-the-hood/duo.jpg', alt: 'Two crocheted frog bags side by side on a shelf: one in a yellow hood and orange vest, one in a blue hood and vest, both with red mouths and long dangling legs' },
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
      image: { src: 'landers/finn-in-the-hood/opening.webp', alt: 'Fingers holding Finn’s thick red mouth rim open to show the green crochet inside' },
    },
    colours: {
      h: 'Pick his hoodie',
      lede: 'Same frog, two outfits. Both have a green body, a cream belly and a thick red mouth.',
      cards: [
        { pick: 'Yellow', title: 'Sunny yellow', text: 'Pointed yellow hood, orange vest with yellow sleeves and a yellow pocket. Bright enough to find in any crowd.', image: { src: 'landers/finn-in-the-hood/frog-sunny.webp', alt: 'Finn in yellow: a green crocheted frog in a pointed yellow hood and an orange vest with yellow sleeves' } },
        { pick: 'Blue', title: 'Blue and cream', text: 'Blue hood and vest, with cream sleeves and a cream pocket. The calmer one, and easy with jeans.', image: { src: 'landers/finn-in-the-hood/frog-blue.jpg', alt: 'Finn in blue: a green crocheted frog in a blue hood and vest with cream sleeves and pocket' } },
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
        { src: 'landers/finn-in-the-hood/life-1.webp', alt: 'Blue Finn worn crossbody over a black knit jumper' },
        { src: 'landers/finn-in-the-hood/life-3.webp', alt: 'Yellow Finn worn over a navy hoodie' },
        { src: 'landers/finn-in-the-hood/gift.webp', alt: 'Yellow Finn hanging by his strap from a cream door handle' },
      ],
    },
    craft: {
      h: 'One hook, one maker, one frog at a time.',
      paras: [
        'Hui crochets every Finn by hand, stitch by stitch: the green body and cream belly, the hood, the little vest with its patch pocket and red buttons, and the long legs that hang loose.',
        'Because a person makes him, no two frogs come out exactly alike. The hood sits at its own angle and the stitches vary a little. That’s how you know he wasn’t printed in a factory.',
      ],
      image: { src: 'landers/finn-in-the-hood/craft.webp', alt: 'Close-up of the orange vest on yellow Finn, with its yellow patch pocket, red buttons and the red mouth rim above' },
    },
    offer: {
      h: 'Pick your frogs',
      lede: 'We suggest two: one to keep, and one for the friend who will ask where you got yours. Two or more ship free, and each frog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'One of each, or a matching pair.', 3: 'Three gifts sorted in one order.' },
      defaults: ['Yellow', 'Blue', 'Yellow'],
      proof: friend,
    },
    reviews: [sturdy, { reviewer: 'Nicola', date: '2026-07-22' }, friend],
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
      image: { src: 'products/cat-crossbody-bag-with-dangling-legs/01.webp', alt: 'Three crochet cat bags on a wooden shelf: black in a pink sweater, yellow in a blue sweater and brown in a striped sweater' },
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
      image: { src: 'products/cat-crossbody-bag-with-dangling-legs/08.webp', alt: 'Brown Miso open, with his wide orange mouth holding earbuds and a compact' },
    },
    colours: {
      h: 'Three cats, three sweaters',
      lede: 'Every Miso has the same cheeky face. The sweater is what makes him yours.',
      cards: [
        { pick: 'Black Cat', title: 'Black in pink', text: 'Pink sweater with a little blue fish, and an orange mouth. Sharp against a camel coat.', image: { src: 'landers/miso-cat/cat-black.webp', alt: 'Black Miso in a pink sweater with a blue fish' } },
        { pick: 'Brown Cat', title: 'Brown in stripes', text: 'Cream and tan striped sweater with a tiny yellow face on the chest, and an orange mouth. Cosy with knitwear.', image: { src: 'landers/miso-cat/cat-brown.webp', alt: 'Brown Miso in a cream and tan striped sweater with a tiny yellow face' } },
        { pick: 'Yellow Cat', title: 'Yellow in blue', text: 'Blue sweater with a small pink fish, and a pink mouth. The sunny one.', image: { src: 'landers/miso-cat/cat-yellow.webp', alt: 'Yellow Miso in a blue sweater with a pink fish' } },
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
        { src: 'landers/miso-cat/life-4.webp', alt: 'Black Miso worn crossbody over a long beige trench coat' },
        { src: 'landers/miso-cat/life-2.webp', alt: 'Brown Miso worn over an oatmeal jumper' },
        { src: 'landers/miso-cat/life-6.webp', alt: 'Yellow Miso worn on a striped shirt' },
      ],
    },
    craft: {
      h: 'Hui makes your cat by hand.',
      paras: [
        'There is no factory and no mould. Hui crochets each Miso stitch by stitch: his face and big round eyes, the sweater with its fish or stripes, and the long arms and legs that hang loose.',
        'Because a person makes him, no two cats are exactly alike. The eyes sit at slightly different angles, and each one looks cheeky in his own way.',
      ],
      image: { src: 'landers/miso-cat/craft.webp', alt: 'A hand holding the finished brown Miso, showing his striped sweater and strap' },
    },
    offer: {
      h: 'Pick your cats',
      lede: 'We suggest two: one to keep, and one for the cat person in your life. Two or more ship free, and each cat costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two sweaters.', 3: 'One of each sweater, or any three.' },
      defaults: ['Black Cat', 'Brown Cat', 'Yellow Cat'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, friend],
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
      image: { src: 'landers/snout-and-about/trio.webp', alt: 'Three plush crochet dog bags on a wooden shelf: a grey schnauzer, a beige puppy and a white terrier' },
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
      image: { src: 'landers/snout-and-about/inside.webp', alt: 'The beige puppy bag on a grey coat with a phone and its brown strap' },
    },
    colours: {
      h: 'A schnauzer, a puppy or a terrier',
      lede: 'Three dogs, all the same price. Mix them however you like.',
      cards: [
        { pick: 'Grey Schnauzer', title: 'Grey schnauzer', text: 'Grey with cream eyebrows and a white muzzle. Looks serious, isn’t.', image: { src: 'landers/snout-and-about/dog-grey.webp', alt: 'Grey schnauzer bag with cream eyebrows and a puffy black nose' } },
        { pick: 'Beige Puppy', title: 'Beige puppy', text: 'Golden beige with long floppy ears. The one everybody wants to pat.', image: { src: 'landers/snout-and-about/dog-beige.webp', alt: 'Beige puppy bag with long floppy ears' } },
        { pick: 'White Terrier', title: 'White terrier', text: 'Fluffy white with pink ears and a big black nose. Bright against a dark coat.', image: { src: 'landers/snout-and-about/dog-white.webp', alt: 'White terrier bag with pink ears and a black nose' } },
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
        { src: 'landers/snout-and-about/life-1.webp', alt: 'Beige puppy bag worn crossbody over a cream cable-knit jumper' },
        { src: 'landers/snout-and-about/life-4.webp', alt: 'White terrier bag worn crossbody over a brown jumper' },
        { src: 'landers/snout-and-about/life-2.webp', alt: 'Grey schnauzer bag worn over a long beige coat' },
      ],
    },
    craft: {
      h: 'Made by hand, one dog at a time.',
      paras: [
        'Hui crochets every dog by hand in plush yarn, then gives him his puffy nose and eyes. The schnauzer gets his cream eyebrows, the puppy his floppy ears.',
        'Because a person makes him, no two dogs come out quite the same. The fluff falls its own way, and every face has its own expression.',
      ],
      image: { src: 'landers/snout-and-about/detail.webp', alt: 'Close-up of the soft plush yarn and the knotted brown strap' },
    },
    offer: {
      h: 'Pick your dogs',
      lede: 'We suggest two: one for you, and one for the dog lover who will ask where you got yours. Two or more ship free, and each dog costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two dogs.', 3: 'One of each, or any three.' },
      defaults: ['Grey Schnauzer', 'Beige Puppy', 'White Terrier'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, friend],
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
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/01.jpg', alt: 'Three fluffy crochet bags on a wooden shelf: a white puppy, a yellow bear and a brown cat' },
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
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/13.jpg', alt: 'The puppy bag open, holding a phone, a wallet and a compact' },
    },
    colours: {
      h: 'Meet the guests',
      lede: 'Same size, same price. Pick a favourite, or bring the whole party.',
      cards: [
        { pick: 'White Puppy', title: 'The puppy', text: 'White plush, long black floppy ears, a blue party hat and a tiny strawberry cake.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/02.jpg', alt: 'White puppy bag with black floppy ears, a blue party hat and a strawberry cake' } },
        { pick: 'Yellow Bear', title: 'The bear', text: 'Buttery yellow, with a striped party hat and a little plate of chocolate cookies.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/06.jpg', alt: 'Yellow bear bag in a striped party hat, holding a plate of cookies, worn over a black jumper' } },
        { pick: 'Brown Cat', title: 'The cat', text: 'Soft brown plush, whiskers, and a brown-and-white polka-dot bow.', image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/09.jpg', alt: 'Brown cat bag with a polka-dot bow, held up by its strap' } },
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
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/03.jpg', alt: 'Puppy bag worn crossbody over a beige sweatshirt' },
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/08.jpg', alt: 'Bear bag worn over a black jumper' },
        { src: 'products/plush-crossbody-bag-puppy-bear-cat/11.jpg', alt: 'Cat bag worn crossbody over a cream jumper' },
      ],
    },
    craft: {
      h: 'Fluffy, and made by hand.',
      paras: [
        'Hui crochets each Party Animal by hand in plush yarn, then adds the face, the ears and the little extras: the puppy’s cake, the bear’s cookies, the cat’s bow.',
        'Because a person makes them, no two come out quite the same. The fluff falls its own way, and every face has its own expression.',
      ],
      image: { src: 'products/plush-crossbody-bag-puppy-bear-cat/12.jpg', alt: 'The cat bag worn at the side, showing its whiskers and bow' },
    },
    offer: {
      h: 'Pick your party',
      lede: 'We suggest two: one to keep, and one for the friend whose birthday is coming up. Two or more ship free, and each bag costs less.',
      flag2: 'Keep one, gift one',
      notes: { 1: 'Just the one, for you.', 2: 'Any two guests.', 3: 'The whole party, or any three.' },
      defaults: ['White Puppy', 'Yellow Bear', 'Brown Cat'],
      proof: friend,
    },
    reviews: [sturdy, secondBuy, friend],
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
      image: { src: 'products/animal-crossbody-phone-bag/01.jpg', alt: 'Four crochet phone bags with googly eyes: a pink cat, a yellow duck, a brown sloth and a green frog' },
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
      image: { src: 'products/animal-crossbody-phone-bag/10.jpg', alt: 'Pink cat crochet phone bag worn crossbody over a cream T-shirt' },
    },
    colours: {
      h: 'Meet the gang',
      lede: 'Same size, same price. Pick your favourite, or start a collection.',
      cards: [
        { pick: 'Sloth', title: 'The sloth', text: 'Warm brown, with two buck teeth, little white claws and a very relaxed look.', image: { src: 'products/animal-crossbody-phone-bag/02.jpg', alt: 'Brown sloth crochet phone bag with googly eyes, buck teeth and white claws' } },
        { pick: 'Pink Cat', title: 'The pink cat', text: 'Bright pink, with yellow eyes, whiskers and long legs that dangle as you walk.', image: { src: 'products/animal-crossbody-phone-bag/03.jpg', alt: 'Pink cat crochet phone bag with yellow eyes, whiskers and long dangling legs' } },
        { pick: 'Yellow Duck', title: 'The yellow duck', text: 'Sunny yellow, with a red beak and red feet.', image: { src: 'products/animal-crossbody-phone-bag/05.jpg', alt: 'Yellow duck crochet phone bag with googly eyes, a red beak and red feet' } },
        { pick: 'Green Frog', title: 'The green frog', text: 'Grass green, with a cheeky red tongue and four little legs.', image: { src: 'products/animal-crossbody-phone-bag/04.jpg', alt: 'Green frog crochet phone bag with googly eyes and a red tongue sticking out' } },
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
        { src: 'products/animal-crossbody-phone-bag/07.jpg', alt: 'Sloth crochet phone bag worn crossbody over a white T-shirt and jeans' },
        { src: 'products/animal-crossbody-phone-bag/09.jpg', alt: 'Pink cat crochet phone bag worn over a cream T-shirt and white skirt' },
        { src: 'products/animal-crossbody-phone-bag/06.jpg', alt: 'The four Googly Gang bags in a row: frog, duck, pink cat and sloth' },
      ],
    },
    craft: {
      h: 'Crocheted by hand, one at a time.',
      paras: [
        'Hui crochets each bag in soft polyester yarn, then adds the face, the belly and the legs by hand.',
        'Because a person makes them, no two are quite the same. Legs come out a little longer or shorter, and every face has its own expression.',
      ],
      image: { src: 'products/animal-crossbody-phone-bag/08.jpg', alt: 'Sloth crochet phone bag worn at the hip, showing its face and claws' },
    },
    offer: {
      h: 'Pick your gang',
      lede: 'We suggest two: one for you, and one for the friend who keeps sending you animal videos. Two or more ship free, and each bag costs less.',
      flag2: 'One for you, one for a friend',
      notes: { 1: 'Just the one, for you.', 2: 'Any two characters.', 3: 'Any three, or three of a favourite.' },
      defaults: ['Pink Cat', 'Green Frog', 'Sloth'],
      proof: friend,
    },
    reviews: [sturdy, friend, { reviewer: 'Jacqueline', date: '2026-05-31' }],
    faq: [
      { q: 'Will my phone fit?', a: 'Yes. The bag is 19 cm tall and 12 cm wide, so your phone goes in with room for a card and keys.' },
      { q: 'Does it close?', a: 'Yes, with a magnetic snap. It clicks shut on its own, so there’s no zip to open.' },
      kidsFaq('bag'),
      { q: 'How do I wash it?', a: 'Hand wash in cool water with a mild detergent, reshape it and lay it flat to dry. Don’t put it in the machine or the dryer.' },
      arriveFaq('bag'),
      returnsFaq,
    ],
  },
];

export const landerBySlug = (slug: string) => LANDERS.find((l) => l.slug === slug);
