/* ============================================================
   Disemba Crochet — June, the offline assistant
   A small, gentle, entirely client-side helper. No backend,
   no network calls: it listens, understands a little, and is
   always kind.
   ============================================================ */
(function () {
  'use strict';

  var STORE = window.STORE || { whatsapp: '254796074062' };
  var PRODUCTS = window.PRODUCTS || [];
  var WA = STORE.whatsapp;
  var CHAT_KEY = 'disemba-chat-v1';

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[’`]/g, "'")
      .replace(/[^a-z0-9'\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function hasPhrase(tokens, phrase) {
    var pt = phrase.split(' ').filter(Boolean);
    if (!pt.length) return false;
    for (var i = 0; i <= tokens.length - pt.length; i++) {
      var ok = true;
      for (var j = 0; j < pt.length; j++) {
        if (tokens[i + j] !== pt[j]) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }

  function waHref(message) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message);
  }

  /* ---------------- knowledge ---------------- */
  var KB = [
    {
      id: 'bag',
      priority: true,
      kw: ['my bag', 'open my bag', 'show my bag', 'my cart', 'view bag', 'my order', 'the bag i', 'checkout', 'check out'],
      replies: [
        'Of course — let me open your bag for you 🌸 When you are ready, the green WhatsApp button sends everything across in one gentle message.'
      ],
      actions: [{ label: 'Open my bag', type: 'cart' }],
      chips: ['How do I order?', 'Prices', 'Delivery']
    },
    {
      id: 'greet',
      kw: ['hi', 'hey', 'hello', 'hie', 'hiya', 'yo', 'habari', 'jambo', 'sasa', 'mambo', 'niaje', 'good morning', 'good afternoon', 'good evening', 'morning', 'evening', 'howdy'],
      replies: [
        'Hello, and welcome to Disemba Crochet 🌸 I am June. It is lovely to meet you. How are you today?',
        'Hello, lovely 🌸 I am June, here to help you find something handmade and gentle. How can I help you today?',
        'Hi there 🌸 Welcome. Take all the time you need looking around — I am right here if you have a question.'
      ],
      chips: ['What do you make?', 'How do I order?', 'Prices', 'Delivery']
    },
    {
      id: 'howareyou',
      kw: ['how are you', "how're you", 'how are you doing', 'how is your day', 'you ok', 'are you ok', 'how do you feel'],
      replies: [
        'That is kind of you to ask 🌸 I am calm and glad to be here with you. How is your day treating you?',
        'I am well, thank you — quiet and content, which is my favourite way to be 🌸 How are you?'
      ],
      chips: ['What do you make?', 'Prices', 'How do I order?']
    },
    {
      id: 'identity',
      kw: ['who are you', 'your name', 'are you a bot', 'are you real', 'are you human', 'are you ai', 'what are you', 'are you a person', 'is this a bot'],
      replies: [
        'I am June, a small helper for Disemba Crochet 🌸 I live inside this page, so I can answer even with a quiet connection. A real person is always a message away on WhatsApp if you would rather talk to someone.',
        'My name is June. I am the little assistant here — not a person, but I do try to be thoughtful 🌸 Anything you ask about prices, sizes or delivery, a person on WhatsApp can answer fully.'
      ],
      actions: [{ label: 'Chat with a person', type: 'wa' }],
      chips: ['How do I order?', 'Prices', 'What do you make?']
    },
    {
      id: 'thanks',
      kw: ['thank', 'thanks', 'asante', 'thank you', 'appreciate', 'so kind'],
      replies: [
        'You are very welcome 🌸 It is a joy to help. Is there anything else you would like to know?',
        'My pleasure, truly 🌸 Take your time — I am here if anything else comes to mind.'
      ],
      chips: ['See the pieces', 'How do I order?']
    },
    {
      id: 'bye',
      kw: ['bye', 'goodbye', 'see you', 'kwaheri', 'good night', 'talk later', 'that is all', "that's all", 'i am done'],
      replies: [
        'Thank you for visiting Disemba Crochet 🌸 Take care of yourself, and come back whenever you like — your bag will still be here.',
        'Goodbye for now 🌸 I hope your day stays gentle. Everything you chose is saved in your bag.'
      ]
    },
    {
      id: 'compliment',
      kw: ['you are sweet', "you're sweet", 'you are kind', "you're kind", 'i love you', 'you are nice', "you're lovely", 'you are lovely', 'good bot', 'well done'],
      replies: [
        'That is such a kind thing to say — thank you 🌸 You have made my day a little gentler.',
        'How lovely of you 🌸 I will hold on to that. What can I help you with?'
      ]
    },
    {
      id: 'upset',
      kw: ['stupid', 'useless', 'dumb', 'annoying', 'i hate', 'angry', 'frustrated', 'worst', 'bad service'],
      replies: [
        'I am sorry — something has not felt right, and I would rather listen than defend myself 🌸 I am only a small helper, so let me hand you to a person who can truly put it right. The WhatsApp button reaches Disemba Crochet directly.'
      ],
      actions: [{ label: 'Chat on WhatsApp', type: 'wa', value: 'Hello Disemba Crochet 🌸 I was chatting with June on the website and would love to speak with a person.' }],
      chips: []
    },
    {
      id: 'prices',
      kw: ['price', 'prices', 'how much', 'cost', 'costs', 'charge', 'bei', 'shillings', 'ksh', 'rate', 'rates', 'expensive', 'cheap'],
      replies: [
        'Prices are shared on WhatsApp rather than printed here 🌸 Each piece is made to order, so the price depends on the yarn, the size and the colours you choose.\n\nSend the piece you love and you will get a clear price back — no pressure at all.',
        'Nothing here is priced on the page, and there is a reason: everything is made to order, so the price follows the size, yarn and colour you want 🌸 On WhatsApp you will be given a clear, honest figure before anything begins.'
      ],
      actions: [
        { label: 'Ask on WhatsApp', type: 'wa', value: 'Hello Disemba Crochet 🌸 Could you share the price of a piece I like? Thank you 💛' },
        { label: 'See the pieces', type: 'shop', value: 'All pieces' }
      ],
      chips: ['How do I order?', 'Delivery', 'Custom pieces']
    },
    {
      id: 'order',
      kw: ['how do i order', 'how to order', 'order', 'buy', 'purchase', 'i want to', "i'd like", 'i would like', 'how can i get', 'place an order', 'checkout'],
      replies: [
        'It is simple, and I will stay with you 🌸\n\n1. Find the piece you love in the shop\n2. Add it to your bag\n3. Send your bag on WhatsApp — the message writes itself\n\nFrom there you will agree on colours, size and delivery together. Nothing is charged before you have said yes.',
        'Ordering happens through WhatsApp, so you always speak to a person before anything is made 🌸 Choose your pieces, add them to your bag, then press “Send order on WhatsApp”. Your message arrives ready to send.'
      ],
      actions: [
        { label: 'Go to the shop', type: 'shop', value: 'All pieces' },
        { label: 'Open my bag', type: 'cart' }
      ],
      chips: ['Prices', 'Delivery', 'Sizes and colours']
    },
    {
      id: 'delivery',
      kw: ['delivery', 'deliver', 'shipping', 'ship', 'courier', 'postage', 'pick up', 'pickup', 'how long does it take', 'send it to me'],
      replies: [
        'Delivery is arranged on WhatsApp once you have chosen your piece, so it can suit exactly where you are 🌸 Share your location and you will be told the kindest option and the time it will take, before you commit to anything.',
        'Nothing is posted from a warehouse here — your piece is made, then it travels to you. Delivery is discussed on WhatsApp, with your location, so you always know the cost and the date first.'
      ],
      chips: ['How do I order?', 'Prices', 'Do you deliver outside Kenya?']
    },
    {
      id: 'payment',
      kw: ['payment', 'how do i pay', 'mpesa', 'm-pesa', 'paypal', 'cash', 'deposit', 'bank', 'pay'],
      replies: [
        'Payment is arranged together on WhatsApp when your order is confirmed, so you can choose whatever is easiest for you 🌸 Just ask when you send your bag, and it will be explained clearly.'
      ],
      chips: ['Prices', 'Delivery', 'How do I order?']
    },
    {
      id: 'custom',
      kw: ['custom', 'personalised', 'personalized', 'made to measure', 'measurements', 'bespoke', 'my own colour', 'own color', 'different colour', 'different color', 'can you make', 'make one for me', 'special request'],
      replies: [
        'Yes — that is the loveliest part of handmade 🌸 Pieces can be made in your colours and your size. Send a photo or simply describe what you have in mind: an occasion, a shade, a person you are making it for. Even a rough idea is enough to begin.',
        'Custom pieces are very welcome 🌸 Tell Disemba Crochet on WhatsApp what you are imagining — the colours, the size, when you need it — and you will be guided gently from there.'
      ],
      actions: [{ label: 'Start a custom piece', type: 'wa', value: 'Hello Disemba Crochet 🌸 I would love to talk about a custom piece. Here is what I have in mind: ' }],
      chips: ['Colours', 'Sizes', 'How long does it take?']
    },
    {
      id: 'sizes',
      kw: ['size', 'sizes', 'small', 'medium', 'large', 'fit', 'fitting', 'xl', 'xxl', 'measurement'],
      replies: [
        'Everything is made to order, so sizes are arranged with you personally rather than picked from a chart 🌸 Share your measurements — or simply the size you usually wear — on WhatsApp, and your piece will be made to fit you.',
        'Because each piece is made for one person, fit is a conversation rather than a dropdown 🌸 On WhatsApp you can give your measurements or the fit you prefer, and it will be made to suit you.'
      ],
      chips: ['Colours', 'Custom pieces', 'How do I order?']
    },
    {
      id: 'colors',
      kw: ['colour', 'color', 'colours', 'colors', 'shade', 'yarn colour', 'yarn color', 'which colours'],
      replies: [
        'There are many shades to choose from, and most pieces can be made in the colour you love 🌸 Tell us the shade you are dreaming of on WhatsApp — a photo of a fabric or a flower works beautifully — and you will see what is possible.'
      ],
      chips: ['Custom pieces', 'Sizes', 'Prices']
    },
    {
      id: 'materials',
      kw: ['material', 'materials', 'yarn', 'wool', 'cotton', 'acrylic', 'what is it made of', 'made of', 'fabric'],
      replies: [
        'Every piece is crocheted by hand in soft yarn, chosen for comfort and for lasting well 🌸 If you would like to know exactly what a particular piece is made of, or you prefer cotton, just ask on WhatsApp — you will get a straight answer.'
      ],
      chips: ['Care instructions', 'Prices', 'Custom pieces']
    },
    {
      id: 'care',
      kw: ['care', 'wash', 'washing', 'clean', 'laundry', 'iron', 'dry', 'how do i keep', 'take care of'],
      replies: [
        'Care is gentle, like the making 🌸 Hand wash in cool water with a mild soap, squeeze softly rather than wringing, and dry flat in the shade. Keep it folded rather than hung and it will stay beautiful for years.',
        'Treat it kindly and it will last a long time 🌸 Cool hand wash, no wringing, dry flat in the shade, and fold rather than hang. That is all it asks.'
      ],
      chips: ['Materials', 'See the pieces']
    },
    {
      id: 'time',
      kw: ['how long', 'how many days', 'how many weeks', 'when will it be ready', 'ready by', 'turnaround', 'wait', 'how soon', 'deadline'],
      replies: [
        'Because everything is made by hand, the time depends on the piece — a beanie is quick, a blanket takes much longer 🌸 When you message on WhatsApp you will be given a realistic date before anything begins, so there are no surprises.',
        'Hands need time, and yours will not be rushed 🌸 A small piece can be ready in days, a larger one in weeks. Ask on WhatsApp with the date you need it and you will be told honestly whether it is possible.'
      ],
      chips: ['How do I order?', 'Prices', 'Custom pieces']
    },
    {
      id: 'returns',
      kw: ['return', 'refund', 'exchange', 'broken', 'damaged', 'wrong size', 'not happy', 'complaint'],
      replies: [
        'If something arrives damaged, or not as you agreed, please message on WhatsApp straight away with a photo — it will be put right 🌸 Because pieces are made to order, a change of mind is best discussed early. Either way, you will be treated kindly.'
      ],
      actions: [{ label: 'Message on WhatsApp', type: 'wa', value: 'Hello Disemba Crochet 🌸 I would like to talk about an order I received.' }],
      chips: ['Sizes', 'Care instructions']
    },
    {
      id: 'gifts',
      kw: ['gift', 'gifts', 'present', 'birthday', 'anniversary', 'christmas', 'wedding', 'graduation', 'baby shower', 'bridesmaid'],
      replies: [
        'Handmade is such a tender gift 🌸 Beanies, scarves, baby sets and blankets are all lovely for birthdays, weddings and new arrivals. Tell us the occasion and the colours on WhatsApp and you will be helped to choose something that feels right.',
        'A handmade gift carries the time it took to make 🌸 If you tell me the occasion, I can suggest a few pieces — or you can ask on WhatsApp for something made especially for them.'
      ],
      actions: [{ label: 'See gift-worthy pieces', type: 'shop', value: 'All pieces' }],
      chips: ['Baby pieces', 'Blankets', 'Custom pieces']
    },
    {
      id: 'baby',
      kw: ['baby', 'newborn', 'kids', 'children', 'child', 'infant', 'toddler'],
      replies: [
        'There is a soft bonnet and booties set for newborns, and blankets that make beautiful keepsakes 🌸 Everything is made by hand in gentle yarn. Have a look, or ask on WhatsApp for a custom baby gift — they are some of the sweetest pieces to make.'
      ],
      actions: [{ label: 'Baby & kids', type: 'shop', value: 'Baby & Kids' }],
      chips: ['Blankets', 'Gifts', 'Prices']
    },
    {
      id: 'bulk',
      kw: ['bulk', 'wholesale', 'reseller', 'resell', 'many pieces', 'boutique', 'shop owner', 'event', 'bridal party'],
      replies: [
        'For several pieces, a boutique order or a special event, message on WhatsApp with what you have in mind 🌸 Enough notice makes it possible — and it is always nicer to plan these things together.'
      ],
      actions: [{ label: 'Talk about a larger order', type: 'wa', value: 'Hello Disemba Crochet 🌸 I would like to ask about ordering several pieces.' }],
      chips: ['Custom pieces', 'How long does it take?']
    },
    {
      id: 'bags',
      kw: ['bag', 'bags', 'handbag', 'tote', 'purse', 'backpack', 'clutch', 'bucket bag', 'evening bag'],
      replies: [
        'The bags are a lovely place to begin 🌸 There are market totes, granny-square shoulder bags, a sunflower backpack, bow bags, and little round bags for the evening — each one crocheted by hand.',
        'Bags are the heart of Disemba Crochet 🌸 Soft totes, structured squares, a bow bag with daisies, and round clasp bags that catch the light. Have a look — and if you want one in another colour, just ask.'
      ],
      actions: [{ label: 'Browse bags', type: 'shop', value: 'Bags' }],
      chips: ['Prices', 'How do I order?', 'Colours']
    },
    {
      id: 'tops',
      kw: ['top', 'tops', 'halter', 'crop top', 'blouse', 'camisole', 'tube top', 'bandeau', 'summer top'],
      replies: [
        'The tops are light and summery 🌸 Halter crops in blue, violet, ruby and tangerine, a lace-up ivory halter, a scarlet tube top, and soft sets with matching shorts. All made to order in your size.',
        'There are halter crop tops in several shades, a lace-up ivory one, a bandeau, and matching two-piece sets 🌸 Since they are made to order, the fit and the colour are yours to choose.'
      ],
      actions: [{ label: 'Browse tops', type: 'shop', value: 'Tops' }],
      chips: ['Sizes', 'Colours', 'Prices']
    },
    {
      id: 'sweaters',
      kw: ['sweater', 'sweaters', 'cardigan', 'jumper', 'pullover', 'vest', 'knitwear', 'sweatshirt', 'cosy layer'],
      replies: [
        'For cooler days there are stripe cardigans, a colourblock sweater, a chevron jacket, a cropped rosé stripe sweater, an open-knit black crop and a crimson V-neck vest 🌸 Warm, and made to fit you.',
        'The sweaters and cardigans are some of the cosiest pieces here 🌸 Cardigans, a boxy chevron jacket, a colourblock crew neck and a preppy V-neck vest — all handmade and made to order.'
      ],
      actions: [{ label: 'Browse sweaters', type: 'shop', value: 'Sweaters & Cardigans' }],
      chips: ['Sizes', 'Colours', 'Prices']
    },
    {
      id: 'hats',
      kw: ['beanie', 'beanies', 'hat', 'hats', 'winter hat', 'slouch', 'headwear'],
      replies: [
        'The beanies are made in a thick ribbed stitch with a deep folded cuff 🌸 A slouchy grey marl, a classic ruby red, and a set in cherry red and sage green. Simple, warm and made by hand.',
        'There is a soft slouch beanie and classic ribbed beanies in red, sage and cherry tones 🌸 They make a lovely small gift — and a gentle first order if you are new here.'
      ],
      actions: [{ label: 'Browse beanies', type: 'shop', value: 'Beanies & Hats' }],
      chips: ['Prices', 'Gifts', 'Care instructions']
    },
    {
      id: 'scarves',
      kw: ['scarf', 'scarves', 'shawl', 'wrap', 'muffler', 'fringe'],
      replies: [
        'There are two scarves: a thick mustard-and-denim scarf with a knotted fringe, and a long ruby scarf made to wrap twice 🌸 Both are soft, generous and very giftable.'
      ],
      actions: [{ label: 'Browse scarves', type: 'shop', value: 'Scarves & Wraps' }],
      chips: ['Gifts', 'Care instructions', 'Prices']
    },
    {
      id: 'blankets',
      kw: ['blanket', 'blankets', 'throw', 'afghan', 'bed', 'home decor', 'keepsake'],
      replies: [
        'The granny-square blanket is a keepsake — every square a slightly different colour, edged in soft yellow 🌸 It takes time to make, and it is the sort of piece that gets passed down.'
      ],
      actions: [{ label: 'See the blanket', type: 'shop', value: 'Blankets' }],
      chips: ['Gifts', 'How long does it take?', 'Prices']
    },
    {
      id: 'swim',
      kw: ['bikini', 'swim', 'swimsuit', 'swimwear', 'beach', 'two piece', 'swimming'],
      replies: [
        'There is a sunset-orange two-piece, crocheted to order in your size 🌸 A halter top with a tie back and tie-side bottoms — made for long days by the water.'
      ],
      actions: [{ label: 'Browse swimwear', type: 'shop', value: 'Swimwear' }],
      chips: ['Sizes', 'Colours', 'Prices']
    },
    {
      id: 'dresses',
      kw: ['dress', 'dresses', 'gown', 'frock', 'bodycon'],
      replies: [
        'The rainbow stripe dress is the one people ask about 🌸 Candy-coloured stripes, a scalloped hem and adjustable straps, made to your measurements. It is a bit of joy to wear.'
      ],
      actions: [{ label: 'See the dress', type: 'shop', value: 'Dresses' }],
      chips: ['Sizes', 'Colours', 'Prices']
    },
    {
      id: 'new',
      kw: ['new', 'new arrivals', "what's new", 'whats new', 'latest', 'trending', 'popular', 'best seller', 'bestseller', 'most loved', 'featured'],
      replies: [
        'The pieces on the home page are the ones loved most right now 🌸 The granny-square blanket, the rosé stripe sweater, the violet bow bag and the sunflower backpack are often the first to be asked about.'
      ],
      actions: [{ label: 'See loved pieces', type: 'shop', value: 'All pieces' }],
      chips: ['Bags', 'Tops', 'Prices']
    },
    {
      id: 'social',
      kw: ['tiktok', 'instagram', 'facebook', 'social', 'follow', 'your page', 'your account', 'video', 'videos'],
      replies: [
        'You can watch the work in motion on TikTok — @junemwende0 🌸 There are videos of pieces being made, which is the closest thing to sitting beside the hook.'
      ],
      actions: [{ label: 'Open TikTok', type: 'link', value: 'https://www.tiktok.com/@junemwende0' }],
      chips: ['What do you make?', 'Prices']
    },
    {
      id: 'where',
      kw: ['where are you', 'location', 'located', 'based', 'where do you', 'which country', 'kenya', 'nairobi', 'outside kenya', 'international'],
      replies: [
        'Disemba Crochet is handmade in Kenya, and pieces travel wherever they are sent 🌸 Delivery is arranged on WhatsApp so the kindest option for your area can be found — including outside Kenya.'
      ],
      chips: ['Delivery', 'How do I order?', 'Prices']
    },
    {
      id: 'human',
      kw: ['human', 'real person', 'talk to someone', 'speak to someone', 'owner', 'call you', 'phone number', 'contact you', 'whatsapp number', 'speak to a person'],
      replies: [
        'Of course 🌸 I am only a small helper. The WhatsApp button reaches Disemba Crochet directly — a real person, who will answer you kindly. The number is +254 796 074 062.'
      ],
      actions: [{ label: 'Chat on WhatsApp', type: 'wa' }],
      chips: ['How do I order?', 'Prices']
    },
    {
      id: 'hours',
      kw: ['hours', 'open', 'opening', 'closed', 'when are you available', 'available', 'working hours'],
      replies: [
        'You can write at any hour — your message will wait patiently for you 🌸 Replies come as soon as someone is able to sit down with them.'
      ]
    },
    {
      id: 'help',
      kw: ['help', 'what can you do', 'options', 'menu', 'guide', 'assist', 'what do you make', 'what do you sell', 'what is this'],
      replies: [
        'I can help with a few gentle things 🌸 Choosing a piece, how ordering works, prices, delivery, sizes and colours, care, or custom requests. Ask in your own words — I will do my best, and a person is always on WhatsApp for anything I miss.'
      ],
      actions: [{ label: 'See the pieces', type: 'shop', value: 'All pieces' }],
      chips: ['Bags', 'Tops', 'Prices', 'How do I order?']
    },
    {
      id: 'yes',
      kw: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'alright'],
      replies: [
        'Lovely 🌸 If you tell me what you are looking for — a bag, a top, a gift — I can point you to it. The shop also has everything in one place.'
      ],
      chips: ['Bags', 'Tops', 'Gifts']
    },
    {
      id: 'no',
      kw: ['no', 'nope', 'nah', 'not really', 'maybe later'],
      replies: [
        'That is completely alright 🌸 Take your time. I will be right here if anything comes to mind.'
      ]
    },
    {
      id: 'story',
      kw: ['story', 'about', 'who made', 'handmade', 'your work', 'how do you make', 'your story', 'the brand'],
      replies: [
        'Disemba Crochet is a small handmade studio 🌸 Every piece is crocheted by hand, one stitch at a time, and made to order — so nothing is rushed and nothing is quite repeated. That is the whole idea, really. There is a little more of the story on the About page.'
      ],
      actions: [{ label: 'Read the story', type: 'link', value: 'about.html' }],
      chips: ['What do you make?', 'Prices']
    },
    {
      id: 'discount',
      kw: ['discount', 'discounts', 'offer', 'sale', 'bargain', 'negotiate', 'lower price', 'reduce'],
      replies: [
        'Prices are kept fair for handmade work, so there is not much room to move 🌸 But do ask on WhatsApp, especially for several pieces at once — kindness works in both directions.'
      ],
      actions: [{ label: 'Ask on WhatsApp', type: 'wa', value: 'Hello Disemba Crochet 🌸 I would like to ask about a piece I love.' }],
      chips: ['Prices', 'How do I order?']
    },
    {
      id: 'praise',
      kw: ['beautiful', 'lovely', 'pretty', 'gorgeous', 'stunning', 'amazing', 'so nice', 'i like it'],
      replies: [
        'Aren’t they lovely 🌸 Each one is made by hand, which is why they all feel a little different. If one has caught your eye, tell me which and I can show you more about it.'
      ],
      chips: ['Bags', 'Tops', 'Beanies']
    },
    {
      id: 'laugh',
      kw: ['lol', 'haha', 'hehe', 'funny'],
      replies: ['I am glad 🌸 A little lightness is good for the day.']
    },
    {
      id: 'fallback',
      kw: [],
      replies: [
        'I am sorry — I did not quite understand that, and I would rather be honest than guess 🌸\n\nI can help with pieces, ordering, prices, delivery, sizes, colours, or care. You could also message Disemba Crochet on WhatsApp, where a person will answer you kindly.',
        'Forgive me — that one slipped past me 🌸 I know about the pieces, how ordering works, prices, delivery, sizes, colours and care. A person on WhatsApp can help with anything beyond that.'
      ],
      actions: [
        { label: 'Chat on WhatsApp', type: 'wa' },
        { label: 'See the pieces', type: 'shop', value: 'All pieces' }
      ],
      chips: ['Bags', 'Tops', 'Prices', 'How do I order?']
    }
  ];

  var DEFAULT_CHIPS = ['What do you make?', 'How do I order?', 'Prices', 'Delivery'];
  var lastReply = {};

  function pick(intent) {
    var list = intent.replies;
    if (!list || !list.length) return '';
    if (list.length === 1) return list[0];
    var idx = Math.floor(Math.random() * list.length);
    if (lastReply[intent.id] === idx) idx = (idx + 1) % list.length;
    lastReply[intent.id] = idx;
    return list[idx];
  }

  function build(intent) {
    return {
      text: pick(intent),
      actions: intent.actions || [],
      chips: intent.chips || DEFAULT_CHIPS
    };
  }

  function bestIntent(tokens, priorityOnly) {
    var best = null;
    var bestScore = 0;
    KB.forEach(function (intent) {
      if (priorityOnly && !intent.priority) return;
      if (!priorityOnly && intent.priority) return;
      if (!intent.kw.length) return;
      var score = 0;
      intent.kw.forEach(function (phrase) {
        if (hasPhrase(tokens, phrase)) {
          score += 1 + phrase.split(' ').length * 0.4;
        }
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return best;
  }

  /* ---------------- product matching ---------------- */
  var GENERIC = ['top', 'bag', 'set', 'hat', 'piece', 'pieces', 'gift', 'style', 'crochet', 'handmade', 'made', 'order', 'the', 'and', 'with', 'your', 'for', 'our', 'of', 'to', 'in', 'is', 'do', 'you', 'have', 'i', 'want', 'like', 'love', 'a', 'an', 'it', 'this', 'that', 'me', 'my'];

  function productTokens(p) {
    var bag = norm(p.name + ' ' + (p.tags || []).join(' ')).split(' ');
    var seen = {};
    return bag.filter(function (w) {
      if (w.length < 3 || GENERIC.indexOf(w) !== -1 || seen[w]) return false;
      seen[w] = true;
      return true;
    });
  }

  var PRODUCT_INDEX = PRODUCTS.map(function (p) {
    return { product: p, tokens: productTokens(p), name: norm(p.name) };
  });

  function matchProduct(tokens, text) {
    var best = null;
    var bestScore = 0;
    PRODUCT_INDEX.forEach(function (entry) {
      var score = 0;
      if (text.indexOf(entry.name) !== -1) score += 6;
      entry.tokens.forEach(function (w) {
        if (tokens.indexOf(w) !== -1) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = entry.product; }
    });
    if (bestScore >= 2) return best;
    return null;
  }

  function productReply(product, text, forceAdd) {
    var askingPrice = /(price|how much|cost|charge|bei|shilling|ksh|rate)/.test(text);

    if (forceAdd) {
      if (window.Disemba && window.Disemba.addToCart) window.Disemba.addToCart(product.slug);
      return {
        text: 'Done — the ' + product.name + ' is in your bag 🌸\n\nWhen you are ready, press the green WhatsApp button and the whole order arrives ready to send.',
        actions: [
          { label: 'Open my bag', type: 'cart' },
          { label: 'View the piece', type: 'product', value: product.slug }
        ],
        chips: ['How do I order?', 'Prices', 'Delivery']
      };
    }

    var opener = askingPrice
      ? 'The ' + product.name + ' is quoted on WhatsApp rather than here, so the price can match your size, yarn and colour 🌸 '
      : 'The ' + product.name + ' — ' + product.short + ' ';

    var extra = askingPrice
      ? 'Send a message and you will get a clear price before anything is made.'
      : 'Every piece is made to order, so it can be made to fit you. Prices are shared on WhatsApp — just ask.';

    return {
      text: opener + '\n\n' + extra,
      actions: [
        { label: 'View the piece', type: 'product', value: product.slug },
        { label: 'Add to bag', type: 'add', value: product.slug },
        { label: 'Ask on WhatsApp', type: 'wa', value: 'Hello Disemba Crochet 🌸 I am interested in the ' + product.name + '. Could you tell me the price and the colours available? Thank you 💛' }
      ],
      chips: ['How do I order?', 'Sizes', 'Delivery']
    };
  }

  /* ---------------- engine ---------------- */
  function respond(input) {
    var text = norm(input);
    var tokens = text.split(' ').filter(Boolean);
    if (!tokens.length) {
      return { text: 'I am here 🌸 Take your time.', actions: [], chips: DEFAULT_CHIPS };
    }

    // "add the sunflower backpack to my bag" is an add, not a request to open the bag
    var wantsAdd = /(^|\s)(add|take|reserve)(\s|$)/.test(text);
    if (wantsAdd) {
      var addable = matchProduct(tokens, text);
      if (addable) return productReply(addable, text, true);
    }

    var priority = bestIntent(tokens, true);
    if (priority) return build(priority);

    var product = matchProduct(tokens, text);
    if (product) return productReply(product, text);

    var intent = bestIntent(tokens, false);
    if (intent) return build(intent);

    return build(KB.filter(function (i) { return i.id === 'fallback'; })[0]);
  }

  /* ---------------- UI ---------------- */
  var ICONS = {
    chat: '<svg class="ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-3.2-.6L3 21l1.9-4.6A8.2 8.2 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>',
    close: '<svg class="ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2.4"/><path d="M12 9.6c0-2.6-1-4.6 0-5.6 1 1 1 3 0 5.6ZM12 14.4c0 2.6 1 4.6 0 5.6-1-1-1-3 0-5.6ZM9.6 12c-2.6 0-4.6-1-5.6 0 1 1 3 1 5.6 0ZM14.4 12c2.6 0 4.6 1 5.6 0-1-1-3-1-5.6 0ZM10 10c-1.8-1.8-3.6-3-4.5-2.1C6.4 8.8 7.6 10.6 10 10ZM14 14c1.8 1.8 3.6 3 4.5 2.1-.9-.9-2.1-2.7-4.5-2.1ZM14 10c1.8-1.8 3.6-3 4.5-2.1-.9.9-2.1 2.7-4.5 2.1ZM10 14c-1.8 1.8-3.6 3-4.5 2.1.9-.9 2.1-2.7 4.5-2.1Z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>'
  };

  var fab, panel, body, chipsBox, input, form;
  var greeted = false;

  function timeGreeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function scrollDown() {
    if (body) body.scrollTop = body.scrollHeight;
  }

  function addMessage(who, text, actions, animate) {
    var wrap = document.createElement('div');
    wrap.className = 'msg msg--' + (who === 'user' ? 'user' : 'bot');
    if (animate === false) wrap.style.animation = 'none';

    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = escapeHTML(text).replace(/\n/g, '<br>');
    wrap.appendChild(bubble);

    if (actions && actions.length) {
      var box = document.createElement('div');
      box.className = 'chat-actions';
      actions.forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'chat-act';
        b.textContent = a.label;
        b.dataset.action = a.type;
        if (a.value) b.dataset.value = a.value;
        box.appendChild(b);
      });
      wrap.appendChild(box);
    }

    body.appendChild(wrap);
    scrollDown();
    return wrap;
  }

  function addTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'msg msg--bot';
    wrap.id = 'chatTyping';
    wrap.innerHTML = '<div class="msg-bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
    body.appendChild(wrap);
    scrollDown();
    return wrap;
  }

  function setChips(list) {
    if (!chipsBox) return;
    chipsBox.innerHTML = '';
    (list || []).slice(0, 4).forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-chip';
      b.textContent = label;
      chipsBox.appendChild(b);
    });
  }

  function saveHistory() {
    try {
      var items = Array.prototype.slice.call(body.querySelectorAll('.msg')).slice(-24).map(function (m) {
        var bubble = m.querySelector('.msg-bubble');
        return {
          who: m.classList.contains('msg--user') ? 'user' : 'bot',
          text: bubble ? bubble.innerText : ''
        };
      });
      sessionStorage.setItem(CHAT_KEY, JSON.stringify(items));
    } catch (err) { /* private mode, never mind */ }
  }

  function restoreHistory() {
    try {
      var raw = JSON.parse(sessionStorage.getItem(CHAT_KEY) || '[]');
      if (!raw.length) return false;
      raw.forEach(function (item) {
        addMessage(item.who, item.text, [], false);
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  function converse(inputText) {
    var trimmed = String(inputText || '').trim();
    if (!trimmed) return;
    addMessage('user', trimmed);
    input.value = '';

    var typing = addTyping();
    var answer = respond(trimmed);
    var delay = Math.min(1500, 520 + answer.text.length * 9);

    setTimeout(function () {
      if (typing && typing.parentNode) typing.remove();
      addMessage('bot', answer.text, answer.actions);
      setChips(answer.chips);
      saveHistory();
    }, delay);
  }

  function openChat() {
    panel.classList.add('is-open');
    fab.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      if (!restoreHistory()) {
        var greet = timeGreeting() + ', and welcome to Disemba Crochet 🌸 I am June, and I am here to help — softly, and at your pace.\n\nHave a look around, or ask me anything about the pieces.';
        addMessage('bot', greet, [], false);
        setChips(DEFAULT_CHIPS);
        saveHistory();
      }
    }
    setTimeout(function () {
      if (window.innerWidth > 760) input.focus();
      scrollDown();
    }, 320);
  }

  function closeChat() {
    panel.classList.remove('is-open');
    fab.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
  }

  function handleAction(el) {
    var type = el.dataset.action;
    var value = el.dataset.value || '';
    if (type === 'shop') {
      window.location.href = (!value || value === 'All pieces')
        ? 'shop.html'
        : 'shop.html?category=' + encodeURIComponent(value);
    } else if (type === 'cart') {
      if (window.Disemba && window.Disemba.openCart) window.Disemba.openCart();
      closeChat();
    } else if (type === 'product') {
      if (window.Disemba && window.Disemba.openProduct) window.Disemba.openProduct(value);
      closeChat();
    } else if (type === 'add') {
      if (window.Disemba && window.Disemba.addToCart) window.Disemba.addToCart(value);
    } else if (type === 'wa') {
      window.open(value ? waHref(value) : waHref('Hello Disemba Crochet 🌸'), '_blank', 'noopener');
    } else if (type === 'link') {
      window.location.href = value;
    }
  }

  function buildUI() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'fab fab-chat';
    fab.id = 'chatFab';
    fab.setAttribute('aria-label', 'Chat with June, the Disemba helper');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '<span class="ping"></span>' + ICONS.chat + ICONS.close;
    document.body.appendChild(fab);

    panel = document.createElement('section');
    panel.className = 'chat';
    panel.id = 'chatPanel';
    panel.setAttribute('aria-label', 'Chat with June');
    panel.innerHTML =
      '<header class="chat-head">' +
        '<span class="chat-avatar">' + ICONS.flower + '</span>' +
        '<span class="chat-who"><strong>June</strong>' +
          '<span><i class="online-dot"></i> here to help, gently</span>' +
        '</span>' +
        '<button type="button" class="chat-x" id="chatClose" aria-label="Close chat">' + ICONS.close + '</button>' +
      '</header>' +
      '<div class="chat-body" id="chatBody" role="log" aria-live="polite"></div>' +
      '<div class="chat-chips" id="chatChips"></div>' +
      '<form class="chat-input" id="chatForm" autocomplete="off">' +
        '<input id="chatText" type="text" placeholder="Write to me gently…" aria-label="Your message" maxlength="300">' +
        '<button class="chat-send" type="submit" aria-label="Send message">' + ICONS.send + '</button>' +
      '</form>' +
      '<p class="chat-disclaimer">June is a little helper · no waiting</p>';
    document.body.appendChild(panel);

    body = panel.querySelector('#chatBody');
    chipsBox = panel.querySelector('#chatChips');
    input = panel.querySelector('#chatText');
    form = panel.querySelector('#chatForm');

    fab.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) closeChat();
      else openChat();
    });
    panel.querySelector('#chatClose').addEventListener('click', closeChat);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      converse(input.value);
    });

    chipsBox.addEventListener('click', function (e) {
      var chip = e.target.closest('.chat-chip');
      if (!chip) return;
      converse(chip.textContent);
    });

    body.addEventListener('click', function (e) {
      var act = e.target.closest('.chat-act');
      if (act) handleAction(act);
    });

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open-chat]');
      if (opener) { e.preventDefault(); openChat(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closeChat();
    });
  }

  function boot() {
    if (!document.querySelector('.fab-wa')) return; // safety
    buildUI();
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fab.querySelector('.ping').style.display = 'none';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.June = { open: function () { openChat(); } };
})();
