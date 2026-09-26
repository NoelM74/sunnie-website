import { site } from './site';

export const categoryFaq: Record<'bags' | 'coasters' | 'hats' | 'shop', { q: string; a: string }[]> = {
  bags: [
    {
      q: 'What phone sizes fit in a crossbody bag?',
      a: 'Each product page lists its exact width and what fits. The frog phone crossbody, for example, fits phones up to 6.7 inches.',
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
      q: 'How many coasters come in a set?',
      a: 'Most sets run four or five pieces. Some designs, like the cat, pig and bear trio, come as a set of three.',
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
      a: 'Every "Buy on Etsy" button leads to the same piece in our Etsy shop. You check out securely on Etsy, and eligible orders are covered by Etsy\'s Purchase Protection.',
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
      a: `Email ${site.email.hello}, or message us through Etsy once you've ordered. We reply ${site.replyTime}.`,
    },
  ],
};
