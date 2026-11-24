/* ============================================================
   Disemba Crochet — product catalogue
   No prices yet: every piece is quoted on WhatsApp.
   ============================================================ */

const STORE = {
  name: 'Disemba Crochet',
  phoneDisplay: '+254 796 074 062',
  phoneDial: '+254796074062',
  whatsapp: '254796074062',
  tiktok: 'https://www.tiktok.com/@junemwende0',
  tiktokHandle: '@junemwende0'
};

function gallery(slug, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    images.push(`assets/img/${slug}-${i}.jpg`);
  }
  return images;
}

const CARE = 'Hand wash in cool water with a gentle soap, squeeze softly (never wring), and dry flat in the shade.';

const PRODUCTS = [
  {
    slug: 'snowfall-slouch-beanie',
    name: 'Snowfall Slouch Beanie',
    category: 'Beanies & Hats',
    images: gallery('snowfall-slouch-beanie', 1),
    featured: true,
    tags: ['beanie', 'hat', 'winter', 'grey', 'slouch', 'warm'],
    short: 'A soft marled slouch beanie with a relaxed crown and a wide folded brim.',
    description: 'A soft, marled slouch beanie with a relaxed crown and a wide folded brim. Worked in a gentle grey-black blend that goes with absolutely everything, it sits low and easy on the head — the kind of hat you reach for without thinking.',
    details: ['Relaxed slouch fit with a deep folded brim', 'Made in a soft grey-black blend yarn', 'Handmade to order, one at a time'],
    care: CARE
  },
  {
    slug: 'midnight-bow-handbag',
    name: 'Midnight Bow Handbag',
    category: 'Bags',
    images: gallery('midnight-bow-handbag', 1),
    featured: true,
    tags: ['bag', 'handbag', 'bow', 'black', 'evening', 'polka dot'],
    short: 'A structured black handbag finished with a hand-tied polka-dot bow.',
    description: 'A neat, structured handbag in deep black, finished with a hand-tied polka-dot bow and a slim shoulder strap. Quietly classic — it works with a linen dress in the afternoon and a little black outfit in the evening.',
    details: ['Structured body with a top flap', 'Hand-tied polka-dot bow detail', 'Removable-feel shoulder strap'],
    care: CARE
  },
  {
    slug: 'peach-popcorn-tote',
    name: 'Peach Popcorn Tote',
    category: 'Bags',
    images: gallery('peach-popcorn-tote', 1),
    featured: true,
    tags: ['bag', 'tote', 'coral', 'peach', 'popcorn stitch', 'small'],
    short: 'A pocket-sized tote in warm coral, worked in bouncy popcorn stitch.',
    description: 'A pocket-sized tote in warm coral, worked all over in bouncy popcorn stitch with two sturdy top handles. Softly textured, sunny in the hand, and just the right size for the essentials.',
    details: ['Popcorn stitch texture throughout', 'Two crocheted top handles', 'Lightweight, roomy everyday size'],
    care: CARE
  },
  {
    slug: 'sunflower-backpack',
    name: 'Sunflower Backpack',
    category: 'Bags',
    images: gallery('sunflower-backpack', 2),
    featured: true,
    tags: ['bag', 'backpack', 'sunflower', 'granny square', 'brown', 'orange'],
    short: 'A drawstring backpack of sunflower granny squares on deep brown.',
    description: 'A drawstring backpack built from bright sunflower granny squares set on deep brown. Each square is worked by hand, so the flowers sit just a little differently — soft, roomy and full of sunshine.',
    details: ['Sunflower granny squares on a brown base', 'Soft drawstring closure', 'Roomy enough for a day out'],
    care: CARE
  },
  {
    slug: 'rose-garden-mini-tote',
    name: 'Rose Garden Mini Tote',
    category: 'Bags',
    images: gallery('rose-garden-mini-tote', 2),
    tags: ['bag', 'tote', 'pink', 'rose', 'small'],
    short: 'A bright rose mini tote with an open, airy stitch.',
    description: 'A bright rose mini tote with an open, airy stitch that lets the light through. Light in the hand and lovely with a summer dress, it carries a phone, a purse and a little lipstick perfectly.',
    details: ['Open-weave airy stitch', 'Two short top handles', 'Compact, hand-held size'],
    care: CARE
  },
  {
    slug: 'plum-market-tote',
    name: 'Plum Market Tote',
    category: 'Bags',
    images: gallery('plum-market-tote', 2),
    tags: ['bag', 'tote', 'market', 'purple', 'plum', 'large'],
    short: 'A generous deep-plum market tote with soft grey handles.',
    description: 'A generous deep-plum market tote with soft grey handles and a firm, flat base. Roomy enough for the market, a laptop, or an over-packed day out — and it holds its shape beautifully.',
    details: ['Deep, roomy body with a firm base', 'Soft grey webbing handles', 'Everyday market-to-office size'],
    care: CARE
  },
  {
    slug: 'garden-granny-square-bag',
    name: 'Garden Granny Square Bag',
    category: 'Bags',
    images: gallery('garden-granny-square-bag', 2),
    featured: true,
    tags: ['bag', 'boho', 'granny square', 'white', 'flowers', 'shoulder'],
    short: 'A boho shoulder bag of cream granny squares, each with a small flower.',
    description: 'A soft boho shoulder bag built from cream granny squares, each one centred with a little red and orange crochet flower. Nostalgic and sweet, with a long strap that sits nicely on the shoulder.',
    details: ['Cream granny squares with crochet flowers', 'Long shoulder strap', 'Soft, slouchy drape'],
    care: CARE
  },
  {
    slug: 'baby-bonnet-booties',
    name: 'Baby Bonnet & Booties Set',
    category: 'Baby & Kids',
    images: gallery('baby-bonnet-booties', 2),
    tags: ['baby', 'newborn', 'bonnet', 'booties', 'gift', 'white'],
    short: 'A newborn bonnet and bootie set in soft white.',
    description: 'A newborn bonnet and bootie set in the softest white, gentle enough for delicate skin. A tender little coming-home gift — and a lovely keepsake for photographs.',
    details: ['Bonnet and matching booties', 'Soft, gentle yarn for newborn skin', 'A sweet baby shower or coming-home gift'],
    care: 'Hand wash in cool water with a gentle baby-safe soap and dry flat in the shade.'
  },
  {
    slug: 'cozy-ribbed-beanies',
    name: 'Cozy Ribbed Beanies',
    category: 'Beanies & Hats',
    images: gallery('cozy-ribbed-beanies', 2),
    tags: ['beanie', 'hat', 'red', 'green', 'ribbed', 'warm', 'winter'],
    short: 'Chunky ribbed beanies with a folded cuff — in cherry red and soft sage.',
    description: 'Chunky ribbed beanies with a deep folded cuff and a small faux-leather label. Made in two easy colours — cherry red and soft sage green — so there is one for her and one for him.',
    details: ['Thick ribbed stitch with a folded cuff', 'Small faux-leather label', 'Available in cherry red and sage green'],
    care: CARE
  },
  {
    slug: 'harvest-stripe-cardigan',
    name: 'Harvest Stripe Cardigan',
    category: 'Sweaters & Cardigans',
    images: gallery('harvest-stripe-cardigan', 2),
    tags: ['cardigan', 'sweater', 'stripes', 'brown', 'green', 'blue'],
    short: 'An open-front cardigan in warm earthy stripes with a lapel collar.',
    description: 'An open-front cardigan in warm earthy stripes, with a lapel collar, roomy sleeves and a relaxed fit. The kind of layer you keep by the door because it goes over everything.',
    details: ['Open front with a lapel collar', 'Warm multi-stripe colourway', 'Relaxed, easy fit'],
    care: CARE
  },
  {
    slug: 'colourblock-knit-sweater',
    name: 'Colourblock Knit Sweater',
    category: 'Sweaters & Cardigans',
    images: gallery('colourblock-knit-sweater', 2),
    tags: ['sweater', 'jumper', 'navy', 'blue', 'cream', 'cosy'],
    short: 'A cosy crew-neck sweater in cream, denim blue and navy blocks.',
    description: 'A cosy crew-neck sweater in soft cream, denim blue and navy blocks, with a ribbed hem and cuffs. Warm, tidy and endlessly wearable.',
    details: ['Crew neck with ribbed trim', 'Three-shade colourblock design', 'Cosy mid-weight stitch'],
    care: CARE
  },
  {
    slug: 'rainbow-granny-square-blanket',
    name: 'Rainbow Granny Square Blanket',
    category: 'Blankets',
    images: gallery('rainbow-granny-square-blanket', 2),
    featured: true,
    tags: ['blanket', 'throw', 'home', 'rainbow', 'colourful', 'gift'],
    short: 'A keepsake blanket of bright granny squares, edged in soft yellow.',
    description: 'A keepsake blanket of bright granny squares, edged in soft yellow. Every square is a slightly different colour, so the whole blanket reads like a scrapbook — made to be curled up under, or passed down.',
    details: ['Bright multicolour granny squares', 'Soft yellow border', 'Large throw size, made to order'],
    care: CARE
  },
  {
    slug: 'berry-halter-set',
    name: 'Berry Halter Set',
    category: 'Tops',
    images: gallery('berry-halter-set', 1),
    tags: ['top', 'shorts', 'set', 'wine', 'burgundy', 'summer'],
    short: 'A wine-toned halter crop top with a scalloped edge, and matching shorts.',
    description: 'A wine-toned halter crop top with a soft scalloped edge, paired with matching shorts. A handmade summer set that looks lovely together — or worn apart with your own favourites.',
    details: ['Halter crop top with scalloped hem', 'Matching shorts included', 'Made to order in your size'],
    care: CARE
  },
  {
    slug: 'blush-bandeau-top',
    name: 'Blush Bandeau Top',
    category: 'Tops',
    images: gallery('blush-bandeau-top', 1),
    tags: ['top', 'bandeau', 'tube', 'pink', 'blush', 'summer'],
    short: 'A soft pink bandeau with a pointed hem and a neat ribbed band.',
    description: 'A soft pink bandeau with a gently pointed hem and a neat ribbed band across the top. Simple and flattering, it layers beautifully under an open shirt or a cardigan.',
    details: ['Fitted bandeau shape', 'Pointed front hem', 'Soft blush pink yarn'],
    care: CARE
  },
  {
    slug: 'ruby-ribbed-beanie',
    name: 'Ruby Ribbed Beanie',
    category: 'Beanies & Hats',
    images: gallery('ruby-ribbed-beanie', 1),
    tags: ['beanie', 'hat', 'red', 'ribbed', 'warm', 'winter'],
    short: 'A classic ribbed beanie in rich red with a turned cuff.',
    description: 'A classic ribbed beanie in rich red with a turned cuff and a small label. Warm, tidy and timeless — the beanie that finishes a winter outfit instead of hiding it.',
    details: ['Deep ribbed stitch', 'Turned cuff with a small label', 'Rich ruby red'],
    care: CARE
  },
  {
    slug: 'azure-chevron-cardigan',
    name: 'Azure Chevron Cardigan',
    category: 'Sweaters & Cardigans',
    images: gallery('azure-chevron-cardigan', 2),
    featured: true,
    tags: ['cardigan', 'jacket', 'navy', 'cream', 'chevron', 'zigzag'],
    short: 'A bold chevron jacket in navy and cream with a rolled collar.',
    description: 'A bold chevron jacket in navy and cream with a rolled collar and three-quarter sleeves. Graphic and a little bit retro — it turns a plain outfit into the outfit.',
    details: ['Navy and cream chevron pattern', 'Rolled collar and three-quarter sleeves', 'Slightly cropped, boxy fit'],
    care: CARE
  },
  {
    slug: 'sun-and-sea-chunky-scarf',
    name: 'Sun & Sea Chunky Scarf',
    category: 'Scarves & Wraps',
    images: gallery('sun-and-sea-chunky-scarf', 2),
    tags: ['scarf', 'chunky', 'mustard', 'blue', 'stripes', 'warm', 'gift'],
    short: 'A thick, squishy scarf in mustard and denim stripes with a knotted fringe.',
    description: 'A thick, squishy scarf in mustard and denim stripes, finished with a hand-knotted fringe. Long enough to wrap twice on a cold morning — and warm enough to mean it.',
    details: ['Thick, soft chunky stitch', 'Mustard and denim stripes', 'Hand-knotted fringe'],
    care: CARE
  },
  {
    slug: 'bubblegum-square-tote',
    name: 'Bubblegum Square Tote',
    category: 'Bags',
    images: gallery('bubblegum-square-tote', 2),
    tags: ['bag', 'tote', 'pink', 'square', 'bold', 'colourful'],
    short: 'A boxy tote in bubblegum pink with white, yellow and black stripes.',
    description: 'A boxy tote in bubblegum pink, framed with white, yellow and black stripes and carried on a tall grab handle. Bright, structured and a little bit playful.',
    details: ['Square, structured body', 'Tall grab handles', 'Pink, white, yellow and black stripes'],
    care: CARE
  },
  {
    slug: 'violet-daisy-bow-bag',
    name: 'Violet Daisy Bow Bag',
    category: 'Bags',
    images: gallery('violet-daisy-bow-bag', 3),
    featured: true,
    tags: ['bag', 'bow', 'purple', 'violet', 'daisy', 'gift'],
    short: 'A playful purple bow-shaped bag with a little daisy at each tail.',
    description: 'A playful purple bag shaped like a big bow, with a little white daisy at each tail. Made for twirling — and the sweetest thing to give a friend who loves a bit of whimsy.',
    details: ['Bow-shaped body with a wrist loop', 'Two crochet daisy motifs', 'Purple yarn with a soft sheen'],
    care: CARE
  },
  {
    slug: 'sunset-orange-bikini',
    name: 'Sunset Orange Bikini',
    category: 'Swimwear',
    images: gallery('sunset-orange-bikini', 3),
    tags: ['bikini', 'swimwear', 'orange', 'beach', 'summer', 'halter'],
    short: 'A two-piece in sunset orange — halter top and tie-side bottoms.',
    description: 'A two-piece crochet bikini in sunset orange: a halter-neck top and tie-side bottoms. Crocheted to order in your size, for long days by the water.',
    details: ['Halter-neck top with tie back', 'Tie-side bottoms', 'Crocheted to order in your size'],
    care: 'Rinse in cool fresh water after wearing, squeeze gently and dry flat in the shade.'
  },
  {
    slug: 'orange-round-clasp-bag',
    name: 'Orange Round Clasp Bag',
    category: 'Bags',
    images: gallery('orange-round-clasp-bag', 3),
    tags: ['bag', 'round', 'orange', 'clasp', 'evening'],
    short: 'A rounded half-moon bag in burnt orange with a top handle and gold clasp.',
    description: 'A rounded half-moon bag in burnt orange, with a neat top handle and a small gold clasp. Warm, sculptural and just the right size for an evening out.',
    details: ['Round half-moon silhouette', 'Top handle and gold clasp', 'Lined opening with a firm base'],
    care: CARE
  },
  {
    slug: 'sky-halter-shorts-set',
    name: 'Sky Halter & Shorts Set',
    category: 'Tops',
    images: gallery('sky-halter-shorts-set', 3),
    tags: ['top', 'shorts', 'set', 'blue', 'navy', 'summer'],
    short: 'A pale blue halter top with colour-block shorts in navy, white and red.',
    description: 'A pale blue halter top with matching colour-block shorts in navy, white and red. Fresh, sporty and summery — a handmade set for warm days.',
    details: ['Pale blue halter top', 'Colour-block shorts included', 'Made to order in your size'],
    care: CARE
  },
  {
    slug: 'azure-halter-crop-top',
    name: 'Azure Halter Crop Top',
    category: 'Tops',
    images: gallery('azure-halter-crop-top', 3),
    featured: true,
    tags: ['top', 'halter', 'blue', 'crop', 'summer'],
    short: 'A bright blue halter crop top with a covered button and tie back.',
    description: 'A bright blue halter crop top with a covered button at the neck and a neat tie back. Fitted, fresh and easy to wear with denim.',
    details: ['Halter neck with a covered button', 'Tie back for an adjustable fit', 'Bright azure blue'],
    care: CARE
  },
  {
    slug: 'rose-stripe-crop-sweater',
    name: 'Rosé Stripe Crop Sweater',
    category: 'Sweaters & Cardigans',
    images: gallery('rose-stripe-crop-sweater', 3),
    featured: true,
    tags: ['sweater', 'crop', 'stripes', 'pink', 'grey', 'puff sleeve'],
    short: 'A cropped sweater in rose, grey and white stripes with puff shoulders.',
    description: 'A cropped sweater in soft rose, grey and white stripes, with gentle puff shoulders and a rolled neckline. Sweet and a little romantic, and lovely with a high-waisted skirt.',
    details: ['Rose, grey and white stripes', 'Puff shoulders with rolled neckline', 'Cropped, slightly boxy fit'],
    care: CARE
  },
  {
    slug: 'amethyst-halter-crop-top',
    name: 'Amethyst Halter Crop Top',
    category: 'Tops',
    images: gallery('amethyst-halter-crop-top', 3),
    tags: ['top', 'halter', 'purple', 'violet', 'crop'],
    short: 'A deep violet halter crop top with a keyhole neckline.',
    description: 'A deep violet halter crop top with a keyhole neckline and a fitted waist. Rich, jewel-toned and quietly striking.',
    details: ['Keyhole neckline with covered button', 'Fitted crop length', 'Deep amethyst violet'],
    care: CARE
  },
  {
    slug: 'ruby-halter-crop-top',
    name: 'Ruby Halter Crop Top',
    category: 'Tops',
    images: gallery('ruby-halter-crop-top', 3),
    tags: ['top', 'halter', 'red', 'crop'],
    short: 'A true red halter crop top with a softly shaped neckline.',
    description: 'A true red halter crop top with a softly shaped neckline and a covered button at the neck. Warm, confident and beautifully simple.',
    details: ['Halter neck with covered button', 'Softly shaped neckline', 'True ruby red'],
    care: CARE
  },
  {
    slug: 'tangerine-halter-crop-top',
    name: 'Tangerine Halter Crop Top',
    category: 'Tops',
    images: gallery('tangerine-halter-crop-top', 3),
    tags: ['top', 'halter', 'orange', 'tangerine', 'crop'],
    short: 'A warm orange halter top in the same flattering shape.',
    description: 'A warm orange halter top, cut in the same flattering shape as our other halters. Bright, summery and handmade just for you.',
    details: ['Halter neck with covered button', 'Fitted crop length', 'Warm tangerine orange'],
    care: CARE
  },
  {
    slug: 'onyx-chain-mesh-bag',
    name: 'Onyx Chain Mesh Bag',
    category: 'Bags',
    images: gallery('onyx-chain-mesh-bag', 3),
    tags: ['bag', 'mesh', 'black', 'chain', 'evening', 'bucket'],
    short: 'A black open-mesh bucket bag with a gold chain handle.',
    description: 'A black open-mesh bucket bag with a gold chain handle that catches the light. Light, airy and a little glamorous — made for evenings.',
    details: ['Open-mesh stitch body', 'Gold-tone chain handle', 'Bucket shape with a soft base'],
    care: CARE
  },
  {
    slug: 'rainbow-stripe-dress',
    name: 'Rainbow Stripe Dress',
    category: 'Dresses',
    images: gallery('rainbow-stripe-dress', 3),
    featured: true,
    tags: ['dress', 'rainbow', 'stripes', 'colourful', 'bodycon', 'summer'],
    short: 'A body-hugging striped dress in candy colours with a scalloped hem.',
    description: 'A body-hugging striped dress in candy colours, with a scalloped hem and adjustable straps. Joyful, bold and made to fit you exactly — the sort of dress people ask about.',
    details: ['Candy-colour stripes throughout', 'Adjustable straps and scalloped hem', 'Made to order to your measurements'],
    care: CARE
  },
  {
    slug: 'crimson-v-neck-vest',
    name: 'Crimson V-Neck Vest',
    category: 'Sweaters & Cardigans',
    images: gallery('crimson-v-neck-vest', 3),
    tags: ['vest', 'sweater vest', 'red', 'cream', 'preppy', 'layering'],
    short: 'A red sweater vest with a cream collar and ribbed trim.',
    description: 'A red sweater vest with a cream collar, cream hem and ribbed trim. Preppy and warm, and lovely layered over a shirt or a long-sleeve tee.',
    details: ['V-neck with a cream collar', 'Ribbed cream hem', 'Made to order in your size'],
    care: CARE
  },
  {
    slug: 'ivory-lace-up-halter',
    name: 'Ivory Lace-Up Halter',
    category: 'Tops',
    images: gallery('ivory-lace-up-halter', 3),
    tags: ['top', 'halter', 'white', 'ivory', 'lace up', 'summer'],
    short: 'A white halter crop top with a lace-up front and crochet tie neck.',
    description: 'A white halter crop top with a lace-up front and a crochet tie at the neck. Soft ivory, delicate detailing, and lovely against sun-warmed skin.',
    details: ['Lace-up front detail', 'Crochet tie at the neck', 'Soft ivory white'],
    care: CARE
  },
  {
    slug: 'noir-open-knit-crop-sweater',
    name: 'Noir Open-Knit Crop Sweater',
    category: 'Sweaters & Cardigans',
    images: gallery('noir-open-knit-crop-sweater', 3),
    tags: ['sweater', 'crop', 'black', 'open knit', 'mesh', 'evening'],
    short: 'A black open-knit crop sweater with long sleeves.',
    description: 'A black open-knit crop sweater with long sleeves and an airy, laddered stitch. Wear it over a slip for the evening, or over a simple tee in the daytime.',
    details: ['Open ladder-stitch knit', 'Long sleeves, cropped length', 'Deep black'],
    care: CARE
  },
  {
    slug: 'scarlet-buttoned-tube-top',
    name: 'Scarlet Buttoned Tube Top',
    category: 'Tops',
    images: gallery('scarlet-buttoned-tube-top', 3),
    tags: ['top', 'tube', 'strapless', 'red', 'buttons', 'chain'],
    short: 'A red strapless top with gold chain straps and side buttons.',
    description: 'A red strapless top with delicate gold chain straps and a row of side buttons. Clean, confident and a little bit special.',
    details: ['Gold-tone chain straps', 'Side button detailing', 'Strapless fitted shape'],
    care: CARE
  },
  {
    slug: 'ruby-fringe-scarf',
    name: 'Ruby Fringe Scarf',
    category: 'Scarves & Wraps',
    images: gallery('ruby-fringe-scarf', 3),
    tags: ['scarf', 'red', 'fringe', 'warm', 'gift', 'winter'],
    short: 'A long, warm scarf in cherry red with a deep twist fringe.',
    description: 'A long, warm scarf in cherry red with a deep twist fringe. Soft, generous and made to wrap twice — a beautiful gift, especially in the cold months.',
    details: ['Long length for a double wrap', 'Deep hand-tied twist fringe', 'Soft cherry red'],
    care: CARE
  },
  {
    slug: 'scarlet-round-clasp-bag',
    name: 'Scarlet Round Clasp Bag',
    category: 'Bags',
    images: gallery('scarlet-round-clasp-bag', 3),
    tags: ['bag', 'round', 'red', 'clasp', 'evening'],
    short: 'A round red bag with a soft half-moon shape and a small gold clasp.',
    description: 'A round red bag in a soft half-moon shape, with a top handle and a small gold clasp. Bold in colour, gentle in form — an easy way to finish an outfit.',
    details: ['Round half-moon silhouette', 'Top handle and gold clasp', 'Deep scarlet red'],
    care: CARE
  }
];

const CATEGORIES = [
  'All pieces',
  'Bags',
  'Tops',
  'Sweaters & Cardigans',
  'Beanies & Hats',
  'Scarves & Wraps',
  'Dresses',
  'Swimwear',
  'Blankets',
  'Baby & Kids'
];

window.STORE = STORE;
window.PRODUCTS = PRODUCTS;
window.CATEGORIES = CATEGORIES;
