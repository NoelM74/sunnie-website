// Gift guides at /gifts/<slug>/. Each pick is a shop product (src/content/products/), so photo,
// name, price and link always match the shop. The "why" lines use only facts from the product
// and bundle pages. A guide with `under` lists every in-stock piece below that euro price instead.

export interface GiftPick { product: string; why: string }
export interface GiftGuide {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  picks?: GiftPick[];
  under?: number;
  faq: { q: string; a: string }[];
}

export const GIFT_GUIDES: GiftGuide[] = [
  {
    slug: 'gifts-for-frog-lovers',
    title: 'Gifts for frog lovers: handmade crochet frog bags',
    description: 'Gift ideas for frog lovers: hand-crocheted frog bags that carry a phone, keys and lip balm. Frogs in overalls, a hoodie or dungarees with a shamrock.',
    h1: 'Gifts for frog lovers',
    intro: 'Every family has a frog person. These are hand-crocheted frogs they can actually use: each one is a bag for a phone, keys and lip balm, with a face that gets noticed.',
    picks: [
      { product: 'frog-phone-crossbody', why: 'A frog in overalls whose big yellow mouth holds a phone up to 6.7 inches. Pink, blue or brown overalls, two straps in the box, and 12 five-star reviews.' },
      { product: 'finn-the-shamrock-frog-bag', why: 'A 39 cm frog in dungarees with a sewn-on shamrock. A good one for anyone far from Ireland. Posted within 4 working days, with 60-day returns.' },
      { product: 'frog-crossbody-purse', why: 'A frog in a pointed hood and a little vest. His big red mouth holds a phone, keys and lip balm. Yellow or blue.' },
      { product: 'frog-crossbody-phone-bag', why: 'His mouth flaps open like a hinge, so a phone drops straight in. Speckled, fuzzy belly and a 110 cm strap.' },
      { product: 'animal-crossbody-phone-bag', why: 'Pick the grass-green frog with googly eyes and a cheeky red tongue. A slim bag that clicks shut with a magnet.' },
    ],
    faq: [
      { q: 'Which frog bag fits the biggest phone?', a: 'The Star Frogs take phones up to 6.7 inches. Finn & the Shamrock carries a large phone in a thick case.' },
      { q: 'Is buying two cheaper?', a: 'Yes, on the Star Frogs, Finn in the Hood and Finn & the Shamrock. Two or more ship free, and each frog costs less.' },
      { q: 'How quickly will it arrive?', a: 'Each frog is made to order and ships within 3 to 5 days with tracking. Finn & the Shamrock is posted within 4 working days.' },
    ],
  },
  {
    slug: 'gifts-for-dog-lovers',
    title: 'Gifts for dog lovers: handmade crochet dog bags',
    description: 'Gift ideas for dog lovers: hand-crocheted dog bags, from a soft schnauzer phone bag to a long squishy dog and a fluffy poodle with its own comb.',
    h1: 'Gifts for dog lovers',
    intro: 'For the friend who stops to pat every dog on the street. Each of these is a hand-crocheted dog that carries a phone or the small things, so the present gets used every day.',
    picks: [
      { product: 'plush-dog-crossbody-phone-bag', why: 'A soft plush phone bag as a grey schnauzer, a beige puppy or a white terrier, with a puffy 3D nose. About 110 g.' },
      { product: 'fluffy-dog-crossbody-bag', why: 'Curly loop-stitch fur, floppy ears and a big black nose. Fits phones up to 6.5 inches. Brown, beige or blue.' },
      { product: 'poodle-crossbody-bag', why: 'A fluffy poodle with three tiny hair clips, and a little comb to keep the fur fluffy. Honey yellow, cream white or caramel.' },
      { product: 'dog-crossbody-purse', why: 'A long, squishy dog, 34 cm from nose to tail, with floppy ears and four round feet. Khaki or yellow.' },
      { product: 'puppy-face-crossbody-bag', why: 'A puppy face with odd eyes and floppy ears. Carry it by the short handle, or crossbody on the 100 cm strap. Cream or tan.' },
      { product: 'plush-crossbody-bag-puppy-bear-cat', why: 'Pick the white puppy in a party hat, with a tiny strawberry cake. A soft plush bag that fits a phone.' },
    ],
    faq: [
      { q: 'Which dog bags fit a phone?', a: 'Snout & About and the Party Animals are made for a phone, and Fuzzy Pups fits phones up to 6.5 inches. The poodle, Stretch Dogs and Puppy Pockets hold a phone too, with keys and lip balm.' },
      { q: 'Are they for adults or kids?', a: 'Both. Adults wear them as crossbody bags, and kids keep coins, small toys and sweets in them. They are bags, not toys, so not for under-3s.' },
      { q: 'Is buying two cheaper?', a: 'Yes, on the dog bags with a bundle page: Snout & About, Fuzzy Pups, Puppy Pockets, Stretch Dogs and the Party Animals. Two or more ship free, and each one costs less.' },
    ],
  },
  {
    slug: 'gifts-for-cat-lovers',
    title: 'Gifts for cat lovers: handmade crochet cat bags and coasters',
    description: 'Gift ideas for cat people who already have the mug: hand-crocheted cat bags in little sweaters, a plush cat with a bow and a cat coaster with a kiwi belly.',
    h1: 'Gifts for cat lovers',
    intro: 'They already have the cat mug, the socks and the tote. These are different: cats crocheted by hand, as bags they can carry and a coaster for the table.',
    picks: [
      { product: 'cat-crossbody-bag-with-dangling-legs', why: 'Miso is a cat in a little sweater with a wide mouth for keys and lip balm, and long legs that dangle as you walk. Black, brown or yellow.' },
      { product: 'plush-crossbody-bag-puppy-bear-cat', why: 'Pick the brown cat in her polka-dot bow. Soft plush, roomy enough for a phone, a wallet and a compact.' },
      { product: 'animal-crossbody-phone-bag', why: 'Pick the bright pink cat with yellow eyes, whiskers and long dangling legs. A slim phone bag that clicks shut with a magnet.' },
      { product: 'animal-coasters-cat-pig-and-bear', why: 'A cream cat coaster with ginger stripes and a kiwi belly, about 15 cm across. Also comes as a set with a pig and a bear.' },
    ],
    faq: [
      { q: 'What fits in the Miso cat bag?', a: 'Keys, lip balm, tissues, earbuds, a compact or a bus card. For a phone, the Party Animals cat or the Googly Gang pink cat are the ones to pick.' },
      { q: 'Can I buy just one cat coaster?', a: 'Yes. The Fruit Bellies come as one, two or the set of three, and two or more ship free.' },
    ],
  },
  {
    slug: 'coaster-sets-housewarming-gifts',
    title: 'Coaster sets as housewarming gifts: handmade crochet coasters',
    description: 'Housewarming gift ideas: hand-crocheted coaster sets in mandalas, sunflowers, roses and carnations, from sets of 2 to packs of 8. Ready to give, and used every day.',
    h1: 'Coaster sets as housewarming gifts',
    intro: 'A new home needs a few things for the table. A set of hand-crocheted coasters gets used from the first cup of tea, and these arrive ready to give, many with a basket or a bouquet fold of their own.',
    picks: [
      { product: 'flower-mandala-coaster', why: 'Flower mandalas about 14 cm across, in a mix of colours chosen by Hui. Packs of 4, 6 or 8, with free mini baskets. Six or eight ship free.' },
      { product: 'rose-flower-coaster-with-mini-basket', why: 'Twelve tiny roses around each 16 cm coaster, and every coaster folds into its own little basket. Sets of 2, 4 or 6 in six colours.' },
      { product: 'carnation-mug-rug-that-folds-into-a-mini', why: 'Each one folds into a carnation bouquet and opens into a 14.5 cm coaster. Pink, purple or mixed, in sets of 2, 4 or 6.' },
      { product: 'mandala-coaster-set-of-5', why: 'Five large 19 cm mandalas, each in its own colourway, so every guest gets a different one.' },
      { product: 'sunflower-coasters-set-of-4', why: 'Four full sunflower shapes with stems and leaves, 14 cm flowers, about 21 cm end to end.' },
      { product: 'flower-coaster-with-stem-and-leaves', why: 'Four 15 cm flower coasters with stems, one in each of four bright colourways.' },
      { product: 'animal-coasters-cat-pig-and-bear', why: 'A pig with a watermelon belly, a bear with an orange slice and a cat with a kiwi, thick and soft, about 15 cm across.' },
    ],
    faq: [
      { q: 'Which coaster set ships free?', a: 'Orders of €50 or more ship free. Fold & Bloom and Potted Roses sets of four or six, Mandala Blooms packs of six or eight, and two or more Fruit Bellies ship free whatever the total.' },
      { q: 'Will a large mug fit?', a: 'Yes. The coasters run from 14 to 19 cm across, wide enough for a large mug.' },
      { q: 'How do they wash?', a: 'Hand wash in cool or lukewarm water, below 40°C, and lay flat to dry. Each product page has its own care note.' },
    ],
  },
  {
    slug: 'mothers-day-gifts',
    title: "Mother's Day gifts: handmade crochet flowers and bags",
    description: "Handmade Mother's Day gift ideas: crochet carnations that fold into a bouquet, rose coasters in a basket, flower bags and a matching big and little set.",
    h1: "Mother's Day gifts",
    intro: 'Flowers that last longer than a week, and bags made for the things she actually carries. Every piece here is crocheted by hand by Hui, so it arrives as a present someone made, not one pulled off a shelf.',
    picks: [
      { product: 'carnation-mug-rug-that-folds-into-a-mini', why: 'A crochet carnation that folds into a bouquet tied with a leaf cord, then opens into a coaster for her tea. Pink, purple or mixed, in sets of 2, 4 or 6.' },
      { product: 'rose-flower-coaster-with-mini-basket', why: 'Twelve tiny roses around a 16 cm coaster that folds into its own little basket, so it sits on the shelf like a pot of roses. Six colours.' },
      { product: 'fat-lips-girl-crossbody-phone-bag-with-daisy', why: 'A doll bag with big red lips, pearls and a daisy, in a large and a small size. The big and little set is made for matching days with a daughter.' },
      { product: 'flower-shoulder-bag-with-flower-charm', why: 'Rows of puffy flower buds, in a large and a small size, so mother and child can match without carrying the same bag. Pink, blue or yellow.' },
      { product: '3d-flower-crochet-phone-bag', why: 'A phone bag with a sculpted 3D rose or sunflower on the front, on a 110 cm strap. Rated 5.0 from 2 reviews.' },
      { product: 'tulip-phone-bag', why: 'A phone bag covered in tiny crocheted tulips or sunflowers, with a faux pearl charm and a bud to match.' },
      { product: 'camellia-granny-square-bag', why: 'A granny square purse with a full 3D camellia on the front and a drawstring top. Red, green, pink or orange.' },
    ],
    faq: [
      { q: 'When should I order for Mother’s Day?', a: 'Every piece is made to order and ships within 3 to 5 days, and delivery time after that depends on the country. The shipping page lists the delivery time for each country, so order with that in mind.' },
      { q: 'Can I send it straight to her?', a: 'Yes. Enter her address at checkout and we ship it to her with tracking.' },
      { q: 'Is buying a set cheaper?', a: 'Yes. Fold & Bloom and Potted Roses sets of four or six ship free, and the Pearl & Daisy big and little set costs less than the two bags on their own and ships free.' },
    ],
  },
  {
    slug: 'handmade-gifts-under-40',
    title: 'Handmade gifts under €40: crochet bags, coasters and hats',
    description: 'Handmade gifts under €40: every crochet bag, coaster set and hat in the shop below €40, each one made by hand by Hui.',
    h1: 'Handmade gifts under €40',
    intro: 'A present someone made by hand, without a big price tag. Every piece below costs less than €40 for one, and each is crocheted by Hui and ships within 3 to 5 days with tracking.',
    under: 40,
    faq: [
      { q: 'Is shipping included?', a: 'Shipping is €6 per order, and free on orders of €50 or more. Buy two or more of the same bundle item, such as two Star Frogs, and shipping is free whatever the total.' },
      { q: 'Can I send it straight to the person?', a: 'Yes. Enter their address at checkout. We ship to Ireland, the UK, the US, Canada, Norway and 11 EU countries.' },
      { q: 'What if it isn’t right?', a: 'You can return it within 30 days of delivery for a refund of the item and the original shipping.' },
    ],
  },
];
