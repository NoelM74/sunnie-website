# Owner questions

## Materials — resolved

The "wool" materials question is resolved: the shop uses no animal wool. Product files and site copy now list cotton, polyester or acrylic instead.

**Action for the owner:** update the 11 Etsy listings that still say "Wool" in their materials field, to match the site:

- `3d-flower-crochet-phone-bag` — 3D flower crochet phone bag
- `animal-coasters-cat-pig-and-bear` — Animal coasters, cat, pig and bear
- `blue-stripe-tote-bag-with-removable-flower-charm` — Blue stripe tote bag with removable flower charm
- `bunny-crossbody-bag` — Bunny crossbody bag
- `dog-crossbody-purse` — Dog crossbody purse
- `flower-crossbody-phone-bag` — Flower crossbody phone bag
- `hot-air-balloon-crossbody-bag` — Hot air balloon crossbody bag
- `sheep-crossbody-bag` — Sheep crossbody bag
- `sunflower-drawstring-backpack` — Sunflower drawstring backpack
- `tassel-crossbody-phone-bag` — Tassel crossbody phone bag
- `tulip-phone-bag` — Tulip phone bag

## Photos

Replace src/assets/story/hands.jpg with a photo of Hui crocheting (currently a product photo placeholder).

## Before going live

1. **Option prices for 8 products.** These are marked `siteCheckout: false` (Etsy-only) until you send us the
   per-option price for each pack or size. Once we have real prices, we add `optionPrices` to the product file and
   switch `siteCheckout` back to true:
   - animal-coasters-cat-pig-and-bear
   - carnation-mug-rug-that-folds-into-a-mini
   - fat-lips-girl-crossbody-phone-bag-with-daisy
   - flower-mandala-coaster
   - flower-shoulder-bag-with-flower-charm
   - panda-crossbody-bag
   - rainbow-crochet-wizard-hat
   - rose-flower-coaster-with-mini-basket
2. **UK: settled.** The owner prepays UK VAT and ships DDP, so UK shipping stays open. **EU OSS:** keep an eye on the €10,000 cross-border EU sales threshold with the accountant.
3. **Legal review.** Done 2026-10-03: the owner's solicitor/accountant reviewed `/terms/` and `/privacy/`, no changes needed.
