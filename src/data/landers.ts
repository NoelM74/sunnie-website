import type { BundleDef, BundleSize } from '../lib/bundles';

// Copy and photos for the bundle landers at /go/<slug>/. Prices come from
// BUNDLE_EUR_CENTS in src/lib/bundles.ts; shipping, dispatch and returns come from
// the shop's own settings, so a lander can never promise something checkout doesn't.
// Delivery times live on /shipping/ only.
//
// Photo paths are relative to src/assets/. Review keys point at src/data/reviews.json.

export interface Img { src: string; alt: string }
export interface ReviewKey { reviewer: string; date: string }

export interface Lander extends BundleDef {
  /** The shop product this lander sells, for its link and "Size and materials". */
  productSlug: string;
  title: string;
  description: string;
  og: string;
  bar: string;
  hero: { h1: string; h1em: string; sub: string; image: Img; proof: ReviewKey };
  story: { h: string; paras: string[]; subH: string; subParas: string[] };
  fits: { h: string; lede: string; specs: [string, string][]; image: Img };
  colours: { h: string; lede: string; cards: { pick: string; title: string; text: string; image: Img }[]; note: string };
  uses: { h: string; items: [string, string][]; images: Img[] };
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
      note: 'Can’t choose? The two-frog bundle takes one of each.',
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
    picks: ['Black', 'Brown', 'Yellow'],
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
        { pick: 'Black', title: 'Black in pink', text: 'Pink sweater with a little blue fish, and an orange mouth. Sharp against a camel coat.', image: { src: 'landers/miso-cat/cat-black.webp', alt: 'Black Miso in a pink sweater with a blue fish' } },
        { pick: 'Brown', title: 'Brown in stripes', text: 'Cream and tan striped sweater with a tiny yellow face on the chest, and an orange mouth. Cosy with knitwear.', image: { src: 'landers/miso-cat/cat-brown.webp', alt: 'Brown Miso in a cream and tan striped sweater with a tiny yellow face' } },
        { pick: 'Yellow', title: 'Yellow in blue', text: 'Blue sweater with a small pink fish, and a pink mouth. The sunny one.', image: { src: 'landers/miso-cat/cat-yellow.webp', alt: 'Yellow Miso in a blue sweater with a pink fish' } },
      ],
      note: 'Can’t pick? The three-cat bundle takes one of each.',
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
      defaults: ['Black', 'Brown', 'Yellow'],
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
    picks: ['Grey schnauzer', 'Beige puppy', 'White terrier'],
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
        { pick: 'Grey schnauzer', title: 'Grey schnauzer', text: 'Grey with cream eyebrows and a white muzzle. Looks serious, isn’t.', image: { src: 'landers/snout-and-about/dog-grey.webp', alt: 'Grey schnauzer bag with cream eyebrows and a puffy black nose' } },
        { pick: 'Beige puppy', title: 'Beige puppy', text: 'Golden beige with long floppy ears. The one everybody wants to pat.', image: { src: 'landers/snout-and-about/dog-beige.webp', alt: 'Beige puppy bag with long floppy ears' } },
        { pick: 'White terrier', title: 'White terrier', text: 'Fluffy white with pink ears and a big black nose. Bright against a dark coat.', image: { src: 'landers/snout-and-about/dog-white.webp', alt: 'White terrier bag with pink ears and a black nose' } },
      ],
      note: 'Can’t pick? The three-dog bundle takes one of each.',
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
      defaults: ['Grey schnauzer', 'Beige puppy', 'White terrier'],
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
];

export const landerBySlug = (slug: string) => LANDERS.find((l) => l.slug === slug);
