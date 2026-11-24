/* ============================================================
   Disemba Crochet — app.js
   Cart, product rendering, modal, scroll reveals, WhatsApp
   checkout. No backend, no build step.
   ============================================================ */
(function () {
  'use strict';

  var PRODUCTS = window.PRODUCTS || [];
  var STORE = window.STORE || { whatsapp: '254796074062', phoneDisplay: '+254 796 074 062' };
  var CART_KEY = 'disemba-cart-v1';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------------- icons ---------------- */
  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6 7l1 12h10l1-12"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1c-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4zM12 2C6.6 2 2.1 6.5 2.1 12c0 1.8.5 3.5 1.3 5L2 22l5.3-1.4c1.4.8 3.1 1.2 4.7 1.2 5.5 0 9.9-4.5 9.9-9.9C21.9 6.5 17.5 2 12 2zm0 18.2c-1.5 0-2.9-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.3-2.8-1.3-4.4 0-4.5 3.7-8.2 8.3-8.2s8.2 3.7 8.2 8.2c0 4.6-3.7 8.3-8.2 8.3z"/></svg>'
  };

  /* ---------------- reveal on scroll ---------------- */
  var revealObserver = null;

  function observeReveals(root) {
    var els = $$('[data-reveal], .line-reveal, .rule-draw, .hero-title', root);
    els.forEach(function (el) {
      if (el.dataset.delay) el.style.setProperty('--reveal-delay', el.dataset.delay + 'ms');
    });
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    els.forEach(function (el) {
      if (!el.classList.contains('is-visible')) revealObserver.observe(el);
    });
  }

  /* ---------------- hero letter animation ---------------- */
  function splitTitle(el) {
    if (!el || el.dataset.split === 'done') return;
    var index = 0;
    var lastWord = null;

    function charSpan(ch) {
      var span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = ch;
      span.style.transitionDelay = (index * 26) + 'ms';
      index++;
      return span;
    }

    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          // letters animate, but words stay whole so nothing breaks mid-word
          String(child.textContent).split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              lastWord = null;
              return;
            }
            // trailing punctuation joins the word before it, so a line never starts with a lone '.'
            if (lastWord && /^[^\w]+$/.test(part)) {
              part.split('').forEach(function (ch) { lastWord.appendChild(charSpan(ch)); });
              return;
            }
            var word = document.createElement('span');
            word.className = 'split-word';
            part.split('').forEach(function (ch) { word.appendChild(charSpan(ch)); });
            frag.appendChild(word);
            lastWord = word;
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
    el.dataset.split = 'done';
  }

  /* ---------------- toasts ---------------- */
  function ensureToastWrap() {
    var wrap = $('#toasts');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.id = 'toasts';
      document.body.appendChild(wrap);
    }
    return wrap;
  }

  function toast(message) {
    var wrap = ensureToastWrap();
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = ICON.check + '<span>' + message + '</span>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 420);
    }, 2600);
  }

  /* ---------------- cart state ---------------- */
  function readCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw.filter(function (item) {
        return item && typeof item.slug === 'string' && item.qty > 0;
      });
    } catch (err) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    paintBadge();
    renderCart();
  }

  function findProduct(slug) {
    return PRODUCTS.filter(function (p) { return p.slug === slug; })[0] || null;
  }

  function cartLines() {
    return readCart().map(function (item) {
      return { product: findProduct(item.slug), qty: item.qty };
    }).filter(function (line) { return line.product; });
  }

  function cartCount() {
    return readCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function paintBadge() {
    var count = cartCount();
    $$('.cart-count').forEach(function (badge) {
      badge.textContent = count;
      badge.classList.toggle('is-on', count > 0);
    });
    var headCount = $('#cartHeadCount');
    if (headCount) headCount.textContent = count ? '(' + count + ')' : '';
  }

  function addToCart(slug, qty) {
    qty = qty || 1;
    var product = findProduct(slug);
    if (!product) return;
    var items = readCart();
    var existing = items.filter(function (i) { return i.slug === slug; })[0];
    if (existing) existing.qty += qty;
    else items.push({ slug: slug, qty: qty });
    writeCart(items);
    toast(product.name + ' added to your bag');
  }

  function setQty(slug, qty) {
    var items = readCart();
    var line = items.filter(function (i) { return i.slug === slug; })[0];
    if (!line) return;
    if (qty <= 0) items = items.filter(function (i) { return i.slug !== slug; });
    else line.qty = qty;
    writeCart(items);
  }

  function removeFromCart(slug) {
    writeCart(readCart().filter(function (i) { return i.slug !== slug; }));
  }

  /* ---------------- WhatsApp links ---------------- */
  function waLink(message) {
    return 'https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(message);
  }

  function orderLink(lines) {
    var total = lines.reduce(function (n, line) { return n + line.qty; }, 0);
    var list = lines.map(function (line, i) {
      return (i + 1) + '. ' + line.product.name + ' — Qty ' + line.qty;
    }).join('\n');
    return waLink(
      'Hello Disemba Crochet 🌸\n\n' +
      'I would love to place an order:\n' +
      list + '\n\n' +
      'Total items: ' + total + '\n\n' +
      'Could you let me know the price and how to pay? Thank you 💛'
    );
  }

  function productLink(product) {
    return waLink(
      'Hello Disemba Crochet 🌸\n\n' +
      'I have a question about the ' + product.name + '.\n\n' +
      'Could you tell me the price, the colours available and how long it would take to make? Thank you 💛'
    );
  }

  function openExternal(url) {
    window.open(url, '_blank', 'noopener');
  }

  /* ---------------- injected UI ---------------- */
  function buildChrome() {
    if ($('#cartDrawer')) return;

    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'pageOverlay';
    document.body.appendChild(overlay);

    var drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.id = 'cartDrawer';
    drawer.setAttribute('aria-label', 'Your bag');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="cart-head">' +
        '<h2>Your bag <span id="cartHeadCount"></span></h2>' +
        '<button class="cart-close" data-close-cart aria-label="Close bag">' + ICON.close + '</button>' +
      '</div>' +
      '<div class="cart-body" id="cartBody"></div>' +
      '<div id="cartFoot"></div>';
    document.body.appendChild(drawer);

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'productModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Piece details');
    modal.innerHTML = '<div class="modal-panel" id="modalPanel"></div>';
    document.body.appendChild(modal);

    ensureToastWrap();

    paintBadge();
    renderCart();
  }

  /* ---------------- cart rendering ---------------- */
  function renderCart() {
    var body = $('#cartBody');
    var foot = $('#cartFoot');
    if (!body || !foot) return;

    var lines = cartLines();
    var count = cartCount();
    var headCount = $('#cartHeadCount');
    if (headCount) headCount.textContent = count ? '(' + count + ')' : '';

    if (!lines.length) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<div class="ce-icon">' + ICON.bag + '</div>' +
          '<h3>Your bag is empty</h3>' +
          '<p>Take your time. Every piece here is handmade, and made just for you.</p>' +
          '<a class="btn btn--primary btn--sm" href="shop.html">Browse the collection</a>' +
        '</div>';
      foot.innerHTML = '';
      return;
    }

    body.innerHTML = lines.map(function (line) {
      var p = line.product;
      return '' +
        '<div class="cart-item">' +
          '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy">' +
          '<div>' +
            '<div class="ci-name">' + p.name + '</div>' +
            '<div class="ci-cat">' + p.category + '</div>' +
            '<div class="qty">' +
              '<button data-qty="' + p.slug + '" data-step="-1" aria-label="Decrease quantity">' + ICON.minus + '</button>' +
              '<span>' + line.qty + '</span>' +
              '<button data-qty="' + p.slug + '" data-step="1" aria-label="Increase quantity">' + ICON.plus + '</button>' +
            '</div>' +
          '</div>' +
          '<button class="ci-remove" data-remove="' + p.slug + '" aria-label="Remove ' + p.name + '">' + ICON.trash + '</button>' +
        '</div>';
    }).join('');

    foot.innerHTML =
      '<div class="cart-foot">' +
        '<div class="cart-summary"><span>' + count + (count === 1 ? ' piece' : ' pieces') + '</span><span>Price on request</span></div>' +
        '<div class="cart-note">' + ICON.info +
          '<span>Prices are not listed. Send your bag on WhatsApp and we will reply with the price, colours and delivery options.</span>' +
        '</div>' +
        '<button class="btn btn--wa btn--block" data-send-order>' + ICON.wa + 'Send order on WhatsApp</button>' +
      '</div>';
  }

  function openCart() {
    buildChrome();
    $('#cartDrawer').classList.add('is-open');
    $('#cartDrawer').setAttribute('aria-hidden', 'false');
    $('#pageOverlay').classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    var drawer = $('#cartDrawer');
    var overlay = $('#pageOverlay');
    if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (overlay && !$('#productModal').classList.contains('is-open')) overlay.classList.remove('is-open');
    if (!document.querySelector('.modal.is-open')) document.body.classList.remove('no-scroll');
  }

  /* ---------------- product modal ---------------- */
  function openProduct(slug) {
    var p = findProduct(slug);
    if (!p) return;
    var panel = $('#modalPanel');
    if (!panel) return;

    var thumbs = p.images.length > 1 ? '<div class="modal-thumbs">' + p.images.map(function (src, i) {
      return '<button data-thumb="' + src + '" class="' + (i === 0 ? 'is-active' : '') + '" aria-label="View photo ' + (i + 1) + '">' +
        '<img src="' + src + '" alt="' + p.name + ' photo ' + (i + 1) + '" loading="lazy">' +
      '</button>';
    }).join('') + '</div>' : '';

    panel.innerHTML =
      '<button class="modal-close" data-close-modal aria-label="Close details">' + ICON.close + '</button>' +
      '<div class="modal-gallery">' +
        '<img class="mg-main" id="modalMainImg" src="' + p.images[0] + '" alt="' + p.name + '">' +
        thumbs +
      '</div>' +
      '<div class="modal-info">' +
        '<p class="product-cat">' + p.category + '</p>' +
        '<h2>' + p.name + '</h2>' +
        '<p class="m-desc">' + p.description + '</p>' +
        '<ul class="m-details">' + p.details.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
        '<div class="m-care"><strong>Care</strong>' + p.care + '</div>' +
        '<div class="m-actions">' +
          '<button class="btn btn--primary" data-add="' + p.slug + '">' + ICON.bag + 'Add to bag</button>' +
          '<a class="btn btn--ghost" href="' + productLink(p) + '" target="_blank" rel="noopener">' + ICON.wa + 'Ask on WhatsApp</a>' +
        '</div>' +
      '</div>';

    var modal = $('#productModal');
    modal.classList.add('is-open');
    $('#pageOverlay').classList.add('is-open');
    document.body.classList.add('no-scroll');
    var mainImg = $('#modalMainImg');
    panel.querySelectorAll('[data-thumb]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mainImg.src = btn.dataset.thumb;
        panel.querySelectorAll('[data-thumb]').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
      });
    });
  }

  function closeModal() {
    var modal = $('#productModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    var overlay = $('#pageOverlay');
    if (overlay && !$('#cartDrawer').classList.contains('is-open')) overlay.classList.remove('is-open');
    if (!$('.cart-drawer.is-open')) document.body.classList.remove('no-scroll');
  }

  /* ---------------- product cards ---------------- */
  function cardHTML(p, i) {
    return '' +
      '<article class="product-card" data-reveal="zoom" style="--reveal-delay:' + ((i % 3) * 90) + 'ms">' +
        '<div class="product-media">' +
          '<span class="product-badge">Made to order</span>' +
          '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" decoding="async">' +
          '<div class="product-overlay">' +
            '<button class="po-btn" data-open-product="' + p.slug + '">View</button>' +
            '<button class="po-btn" data-add="' + p.slug + '">Add to bag</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-body">' +
          '<p class="product-cat">' + p.category + '</p>' +
          '<h3 class="product-name"><a href="shop.html" data-open-product="' + p.slug + '">' + p.name + '</a></h3>' +
          '<p class="product-short">' + p.short + '</p>' +
          '<div class="product-foot">' +
            '<span class="product-note">Price on request</span>' +
            '<button class="add-mini" data-add="' + p.slug + '">' + ICON.plus + ' Add to bag</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderFeatured() {
    var grid = $('#featuredGrid');
    if (!grid) return;
    var featured = PRODUCTS.filter(function (p) { return p.featured; }).slice(0, 6);
    grid.innerHTML = featured.map(cardHTML).join('');
    observeReveals(grid);
  }

  /* ---------------- shop page ---------------- */
  function renderShop() {
    var grid = $('#shopGrid');
    if (!grid) return;

    var filterWrap = $('#shopFilters');
    var countEl = $('#shopCount');
    var active = 'All pieces';

    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('category');
    if (wanted) {
      var match = (window.CATEGORIES || []).filter(function (c) {
        return c.toLowerCase() === wanted.toLowerCase();
      })[0];
      if (match) active = match;
    }

    filterWrap.innerHTML = (window.CATEGORIES || []).map(function (cat) {
      return '<button class="chip' + (cat === active ? ' is-active' : '') + '" data-filter="' + cat + '">' + cat + '</button>';
    }).join('');

    function paint() {
      var items = active === 'All pieces'
        ? PRODUCTS
        : PRODUCTS.filter(function (p) { return p.category === active; });
      grid.innerHTML = items.length
        ? items.map(cardHTML).join('')
        : '<div class="empty-state"><h3>Nothing here just yet</h3><p>Try another category — or ask on WhatsApp, we love a custom request.</p></div>';
      if (countEl) {
        countEl.textContent = items.length + (items.length === 1 ? ' piece' : ' pieces');
      }
      observeReveals(grid);
    }

    filterWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      active = btn.dataset.filter;
      $$('.chip', filterWrap).forEach(function (c) { c.classList.toggle('is-active', c === btn); });
      paint();
      var url = new URL(window.location.href);
      if (active === 'All pieces') url.searchParams.delete('category');
      else url.searchParams.set('category', active);
      window.history.replaceState({}, '', url);
    });

    paint();
  }

  /* ---------------- global listeners ---------------- */
  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        e.preventDefault();
        addToCart(add.dataset.add);
        if (add.closest('.modal')) closeModal();
        return;
      }

      var open = e.target.closest('[data-open-product]');
      if (open) {
        e.preventDefault();
        openProduct(open.dataset.openProduct);
        return;
      }

      var qtyBtn = e.target.closest('[data-qty]');
      if (qtyBtn) {
        var slug = qtyBtn.dataset.qty;
        var step = parseInt(qtyBtn.dataset.step, 10);
        var line = readCart().filter(function (i) { return i.slug === slug; })[0];
        setQty(slug, (line ? line.qty : 0) + step);
        return;
      }

      var remove = e.target.closest('[data-remove]');
      if (remove) { removeFromCart(remove.dataset.remove); return; }

      if (e.target.closest('[data-send-order]')) {
        var lines = cartLines();
        if (!lines.length) return;
        openExternal(orderLink(lines));
        toast('Opening WhatsApp with your order');
        return;
      }

      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); openCart(); return; }
      if (e.target.closest('[data-close-cart]')) { closeCart(); return; }
      if (e.target.closest('[data-close-modal]')) { closeModal(); return; }

      if (e.target.id === 'pageOverlay' || e.target.id === 'productModal') {
        closeCart(); closeModal();
        return;
      }

      var navToggle = e.target.closest('[data-open-menu]');
      if (navToggle) { openMenu(); return; }
      if (e.target.closest('[data-close-menu]')) { closeMenu(); return; }
      var mobileLink = e.target.closest('.mobile-menu a');
      if (mobileLink) { closeMenu(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeCart(); closeModal(); closeMenu(); }
    });

    var form = $('#contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (form.elements.name.value || '').trim();
        var piece = (form.elements.piece.value || '').trim();
        var message = (form.elements.message.value || '').trim();
        var contact = (form.elements.contact.value || '').trim();

        var body = 'Hello Disemba Crochet 🌸\n\n';
        if (name) body += 'My name is ' + name + '.\n';
        if (piece) body += 'I am asking about: ' + piece + '\n';
        if (message) body += '\n' + message + '\n';
        if (contact) body += '\nYou can reach me on: ' + contact + '\n';
        body += '\nThank you 💛';

        openExternal(waLink(body));
        toast('Opening WhatsApp with your message');
        form.reset();
      });
    }

    var yearEls = $$('[data-year]');
    yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // active nav link (works for both /shop and /shop.html)
    var here = window.location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    $$('.nav a, .mobile-menu a[href$=".html"]').forEach(function (link) {
      var target = (link.getAttribute('href') || '').replace(/\.html$/, '');
      if (target === here) link.classList.add('is-active');
    });
  }

  /* ---------------- mobile menu ---------------- */
  function openMenu() {
    var menu = $('#mobileMenu');
    if (!menu) return;
    menu.classList.add('is-open');
    document.body.classList.add('no-scroll');
    $$('#mobileMenu a').forEach(function (a, i) {
      a.style.transitionDelay = (80 + i * 60) + 'ms';
    });
  }
  function closeMenu() {
    var menu = $('#mobileMenu');
    if (menu) menu.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  /* ---------------- header ---------------- */
  function bindHeader() {
    var header = $('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-stuck', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = $('[data-open-menu]');
    if (toggle) toggle.addEventListener('click', openMenu);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    buildChrome();
    bindHeader();
    bindGlobal();

    var title = $('.hero-title');
    if (title) {
      splitTitle(title);
      setTimeout(function () { title.classList.add('is-visible'); }, 220);
    }

    renderFeatured();
    renderShop();
    observeReveals(document);
    paintBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* public API (used by the chat assistant) */
  window.Disemba = {
    products: PRODUCTS,
    addToCart: addToCart,
    openCart: openCart,
    closeCart: closeCart,
    openProduct: openProduct,
    findProduct: findProduct,
    productLink: productLink,
    whatsapp: waLink,
    toast: toast,
    goShop: function (category) {
      window.location.href = category ? 'shop.html?category=' + encodeURIComponent(category) : 'shop.html';
    }
  };
})();
