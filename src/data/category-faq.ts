import { site } from './site';
import { freeShippingAll } from '../lib/money';

const FREE_SHIPPING = freeShippingAll();

export const categoryFaq: Record<'bags' | 'coasters' | 'hats' | 'shop', { q: string; a: string }[]> = {
  bags: [
    {
      q: 'Which crochet crossbody bags fit a phone?',
      a: 'Most of our character bags are made as crossbody phone bags. The Star Frogs and the smiling blue monster bag fit phones up to 6.7 inches, the Big Mouth Monsters and Fuzzy Pups up to 6.5 inches, and Finn & the Shamrock takes a large phone in a thick case. Each product page lists its exact size and what fits.',
    },
    {
      q: 'Which animals do the crochet animal bags come as?',
      a: 'Frogs (Finn & the Shamrock, Finn in the Hood and the Star Frogs), a cat (Miso), dogs (Snout & About, Fuzzy Pups, Puppy Pockets, Stretch Dogs and the fluffy poodle), a panda (Bamboo Buddies), a plush puppy, bear and cat (the Party Animals), and a sloth, cat, duck and frog (the Googly Gang).',
    },
    {
      q: 'Is it cheaper to buy two?',
      a: 'Yes, on the character bags with a bundle page. Two or more of the same bag ship free, and each one costs less than buying it on its own. Mix the colours however you like.',
    },
    {
      q: 'Can I adjust the strap length?',
      a: 'Some straps adjust between crossbody and shoulder length, others are a fixed length. Check the size and materials list on the product page for that detail.',
    },
    {
      q: 'What are the bags made from?',
      a: 'Cotton, polyester or acrylic yarn, depending on the design, with no animal wool anywhere. The daisy granny square tote, for example, is cotton. Each product page lists its exact materials.',
    },
    {
      q: 'How much can a bag differ from the photos?',
      a: 'Each bag is crocheted by hand, so expect 1 to 3 cm of size variation from the listed measurements.',
    },
  ],
  coasters: [
    {
      q: 'What crochet coaster sets do you sell?',
      a: 'Mandala Blooms in packs of 4, 6 or 8 with free mini baskets, large mandala coasters in a set of 5, sunflower coasters in a set of 4, Potted Roses and Fold & Bloom carnations in sets of 2, 4 or 6, and the Fruit Bellies animal coasters as one, two or the set of three.',
    },
    {
      q: 'Do coaster sets ship free?',
      a: `Orders of ${FREE_SHIPPING} or more ship free. On top of that, Fold & Bloom and Potted Roses sets of four or six, Mandala Blooms packs of six or eight, and two or more Fruit Bellies ship free whatever the total.`,
    },
    {
      q: 'What size are the coasters?',
      a: 'Most run 14 to 19 cm across. The exact size for each design is listed on its product page.',
    },
    {
      q: 'Do they make a good gift?',
      a: 'A set doubles as a housewarming or birthday gift, ready to use straight from the box, and the carnation design folds into a bouquet shape for gifting.',
    },
    {
      q: 'How do I wash them?',
      a: 'Hand wash in cool water, reshape while damp and dry flat, away from direct sun.',
    },
  ],
  hats: [
    {
      q: 'What ages does the wizard hat fit?',
      a: '2 to 5 years with a 48 cm brim, or 5 to 9 years with a 58 cm brim.',
    },
    {
      q: 'What is it made from?',
      a: 'Soft acrylic yarn, no animal wool.',
    },
    {
      q: 'Can it double as a costume?',
      a: 'The pointed peak and star appliqué work for dress-up days, not only cold weather.',
    },
    {
      q: 'How do I wash it?',
      a: 'Hand wash, or a cool machine cycle at 40°C or below. Reshape while damp and lay flat to dry.',
    },
  ],
  shop: [
    {
      q: 'Where do I buy from Sunnie Designs?',
      a: `Right here: add pieces to your basket and pay in euro, pounds or dollars with PayPal or any card, no account needed. Shipping is free on orders of ${FREE_SHIPPING} or more, and every order comes with 30-day returns. There are no import charges on delivery to the EU, UK or US.`,
    },
    {
      q: 'Who makes everything in the shop?',
      a: `${site.makerLine}, designing and crocheting every piece stitch by stitch. Nollaig runs the shop side: photos, packing and messages.`,
    },
    {
      q: 'How fast do orders ship?',
      a: `Orders ship in ${site.shipsIn}, with tracking.`,
    },
    {
      q: 'What if I have a question before I buy?',
      a: `Email ${site.email.hello} and a real person replies ${site.replyTime}.`,
    },
  ],
};
