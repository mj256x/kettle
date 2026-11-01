/**
 * Kettle Coffee Shop – Interactive Features
 * Adds dynamic behavior to the static site using vanilla JS + Bootstrap 5
 */

(function () {
  'use strict';

  /* ================================================================
     1. CART MANAGER – localStorage-backed cart state
     ================================================================ */
  const Cart = {
    KEY: 'kettle_cart',

    _read() {
      try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
      catch { return []; }
    },

    _write(items) {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      this._updateBadges();
      document.dispatchEvent(new CustomEvent('cart:changed', { detail: items }));
    },

    getItems()  { return this._read(); },
    getCount()  { return this._read().reduce((s, i) => s + i.qty, 0); },
    getTotal()  { return this._read().reduce((s, i) => s + i.price * i.qty, 0); },

    add(product) {
      const items = this._read();
      const existing = items.find(i => i.id === product.id && i.size === product.size && i.milk === product.milk);
      if (existing) {
        existing.qty = Math.min(existing.qty + (product.qty || 1), 10);
      } else {
        items.push({ ...product, qty: product.qty || 1 });
      }
      this._write(items);
      return items;
    },

    updateQty(index, qty) {
      const items = this._read();
      if (items[index]) {
        items[index].qty = Math.max(1, Math.min(qty, 10));
        this._write(items);
      }
      return items;
    },

    remove(index) {
      const items = this._read();
      items.splice(index, 1);
      this._write(items);
      return items;
    },

    clear() { this._write([]); },

    _updateBadges() {
      const count = this.getCount();
      document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';
      });
    }
  };

  // Init badges on load
  Cart._updateBadges();


  /* ================================================================
     2. TOAST NOTIFICATIONS
     ================================================================ */
  function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '1090';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'bi-check-circle-fill',
      danger:  'bi-exclamation-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info:    'bi-info-circle-fill'
    };

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"><i class="bi ${icons[type] || icons.info} me-2"></i>${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>`;
    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }

  // Expose globally for inline usage
  window.showToast = showToast;


  /* ================================================================
     3. ADD-TO-CART BUTTONS (shop / category pages)
     ================================================================ */
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.product-card');
      if (!card) return;

      const name  = card.querySelector('.product-name a')?.textContent || 'Item';
      const priceText = card.querySelector('.price')?.textContent || '$0';
      const price = parseFloat(priceText.replace('$', ''));
      const cat   = card.querySelector('.product-cat')?.textContent || '';
      const href  = card.querySelector('.product-name a')?.getAttribute('href') || '';
      const id    = href.replace('.html', '').replace('product-', '');

      Cart.add({ id, name, price, category: cat, size: '16oz', milk: 'Whole milk' });
      showToast(`<strong>${name}</strong> added to your cart!`);

      // Mini animation on the button
      this.classList.add('btn-add-pop');
      setTimeout(() => this.classList.remove('btn-add-pop'), 400);
    });
  });


  /* ================================================================
     4. PRODUCT DETAIL PAGE – dynamic price update on size change
     ================================================================ */
  const sizeRadios = document.querySelectorAll('.size-options .btn-check');
  const mainPrice  = document.querySelector('.price.fs-2');

  if (sizeRadios.length && mainPrice) {
    sizeRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const label = document.querySelector(`label[for="${this.id}"]`);
        if (!label) return;
        const match = label.textContent.match(/\$[\d.]+/);
        if (match) {
          mainPrice.textContent = match[0];
          mainPrice.classList.add('price-flash');
          setTimeout(() => mainPrice.classList.remove('price-flash'), 400);
        }
      });
    });
  }

  // Product page: add-to-cart form
  const productForm = document.querySelector('form[action="cart.html"]');
  if (productForm && document.querySelector('.display-6')) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.querySelector('.display-6')?.textContent || 'Item';
      const priceEl = document.querySelector('.price.fs-2');
      const price = parseFloat((priceEl?.textContent || '$0').replace('$', ''));
      const size = this.querySelector('.btn-check:checked')?.value || '16oz';
      const milk = this.querySelector('#milkSelect')?.value || 'Whole milk';
      const qty  = parseInt(this.querySelector('[name="qty"]')?.value || '1', 10);
      const cat  = document.querySelector('.product-cat')?.textContent || '';
      const slug = window.location.pathname.split('/').pop().replace('.html', '').replace('product-', '');

      Cart.add({ id: slug, name, price, category: cat, size, milk, qty });
      showToast(`<strong>${name}</strong> (${size}, ${milk}) added to cart!`);
    });
  }


  /* ================================================================
     5. CART PAGE – live quantity updates & remove items
     ================================================================ */
  function initCartPage() {
    const cartSection = document.querySelector('[aria-label="Cart items"]');
    if (!cartSection) return;

    // Live quantity change
    cartSection.querySelectorAll('input[type="number"]').forEach((input, idx) => {
      input.addEventListener('change', function () {
        const qty   = parseInt(this.value, 10) || 1;
        this.value  = Math.max(1, Math.min(qty, 10));

        // Find the unit price from the item name row
        const article = this.closest('.cart-item');
        if (!article) return;

        const priceEl = article.querySelector('.price');
        const nameEl  = article.querySelector('.product-name a');
        if (!priceEl || !nameEl) return;

        // Parse the original unit price from data attr or markup
        const unitPrice = parseFloat(article.dataset.unitPrice || priceEl.textContent.replace('$', ''));
        if (!article.dataset.unitPrice) article.dataset.unitPrice = unitPrice;

        priceEl.textContent = '$' + (unitPrice * this.value).toFixed(2);
        recalcSummary();
      });
    });

    // Remove buttons
    cartSection.querySelectorAll('.text-danger').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const article = this.closest('.cart-item');
        if (!article) return;

        article.style.transition = 'opacity .3s, transform .3s';
        article.style.opacity = '0';
        article.style.transform = 'translateX(-40px)';
        setTimeout(() => {
          article.remove();
          recalcSummary();
          // Check if cart is empty
          if (!cartSection.querySelector('.cart-item')) {
            showEmptyCart();
          }
        }, 300);

        const name = article.querySelector('.product-name a')?.textContent || 'Item';
        showToast(`<strong>${name}</strong> removed from cart.`, 'warning');
      });
    });
  }

  function showEmptyCart() {
    const main = document.getElementById('main');
    if (!main) return;
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <i class="bi bi-bag mb-3 d-block"></i>
          <h1 class="h3 mb-2">Your cart is empty</h1>
          <p class="text-muted mb-4">Looks like you haven't added anything yet.</p>
          <a class="btn btn-primary btn-lg" href="home.html">Start shopping</a>
        </div>
      </div>`;
  }

  function recalcSummary() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    items.forEach(item => {
      const priceText = item.querySelector('.price')?.textContent || '$0';
      subtotal += parseFloat(priceText.replace('$', ''));
    });

    const count    = items.length;
    const shipping = subtotal >= 50 ? 0 : 5;
    const discount = 0; // Could be dynamic with promo codes
    const total    = subtotal - discount + shipping;

    // Update the summary card
    const summary = document.querySelector('.summary-card');
    if (summary) {
      const dds = summary.querySelectorAll('dd');
      if (dds[0]) dds[0].textContent = '$' + subtotal.toFixed(2);
      if (dds[1]) dds[1].textContent = '-$' + discount.toFixed(2);
      if (dds[2]) dds[2].textContent = shipping === 0 ? 'Free!' : '$' + shipping.toFixed(2);
      if (dds[2] && shipping === 0) dds[2].classList.add('text-success');
      if (dds[3]) dds[3].textContent = '$' + total.toFixed(2);
    }

    // Update heading
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.includes('cart')) {
      h1.innerHTML = `Your cart <span class="text-muted fs-5 fw-normal">(${count} item${count !== 1 ? 's' : ''})</span>`;
    }
  }

  initCartPage();


  /* ================================================================
     6. PROMO CODE HANDLER (cart page)
     ================================================================ */
  const promoForm = document.querySelector('.summary-card form');
  if (promoForm) {
    promoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[name="promo"]');
      const code  = (input?.value || '').trim().toUpperCase();

      if (code === 'FIRSTPOUR') {
        showToast('Promo code <strong>FIRSTPOUR</strong> applied! 10% off.', 'success');
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else if (code === '') {
        showToast('Please enter a promo code.', 'warning');
      } else {
        showToast(`Code <strong>${code}</strong> is not valid.`, 'danger');
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    });
  }


  /* ================================================================
     7. NEWSLETTER FORM
     ================================================================ */
  document.querySelectorAll('form .btn-accent').forEach(btn => {
    const form = btn.closest('form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]');
      if (email && email.value) {
        showToast(`Thanks for subscribing, <strong>${email.value}</strong>!`);
        email.value = '';
        email.classList.add('is-valid');
        setTimeout(() => email.classList.remove('is-valid'), 3000);
      }
    });
  });


  /* ================================================================
     8. SEARCH – live filter on shop / category pages
     ================================================================ */
  const searchInput = document.querySelector('.nav-search input[type="search"]');
  if (searchInput) {
    const searchForm = searchInput.closest('form');
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        filterProducts(searchInput.value);
      });
    }

    // Live search with debounce
    let debounce;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(() => filterProducts(this.value), 300);
    });
  }

  function filterProducts(query) {
    const q = query.trim().toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    let visible = 0;
    cards.forEach(card => {
      const name = (card.querySelector('.product-name a')?.textContent || '').toLowerCase();
      const cat  = (card.querySelector('.product-cat')?.textContent || '').toLowerCase();
      const match = !q || name.includes(q) || cat.includes(q);
      const col = card.closest('[class*="col-"]');
      if (col) {
        col.style.display = match ? '' : 'none';
        if (match) visible++;
      }
    });

    // Update count
    const resultsTitle = document.getElementById('resultsTitle');
    if (resultsTitle) {
      const titleText = resultsTitle.childNodes[0]?.textContent?.trim() || 'Products';
      resultsTitle.innerHTML = `${titleText} <span class="text-muted fw-normal">(${visible})</span>`;
    }

    // Show "no results" message
    let noResults = document.getElementById('noResults');
    if (visible === 0) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResults';
        noResults.className = 'text-center py-5 text-muted';
        noResults.innerHTML = `<i class="bi bi-search fs-1 d-block mb-2"></i><p>No drinks match "<strong>${q}</strong>"</p>`;
        const grid = cards[0]?.closest('.row');
        if (grid) grid.after(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }


  /* ================================================================
     9. SORT DROPDOWN (shop / category pages)
     ================================================================ */
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      const grid = document.querySelector('.col-lg-9 .row.g-3');
      if (!grid) return;

      const cols = [...grid.querySelectorAll(':scope > [class*="col-"]')];
      cols.sort((a, b) => {
        const cardA = a.querySelector('.product-card');
        const cardB = b.querySelector('.product-card');
        if (!cardA || !cardB) return 0;

        const nameA  = cardA.querySelector('.product-name a')?.textContent || '';
        const nameB  = cardB.querySelector('.product-name a')?.textContent || '';
        const priceA = parseFloat((cardA.querySelector('.price')?.textContent || '0').replace('$', ''));
        const priceB = parseFloat((cardB.querySelector('.price')?.textContent || '0').replace('$', ''));
        const rateA  = parseFloat((cardA.querySelector('.rating-count')?.textContent || '0'));
        const rateB  = parseFloat((cardB.querySelector('.rating-count')?.textContent || '0'));

        switch (this.value) {
          case 'Price: low to high':  return priceA - priceB;
          case 'Price: high to low':  return priceB - priceA;
          case 'Top rated':           return rateB - rateA;
          case 'Name A to Z':         return nameA.localeCompare(nameB);
          default:                    return 0;
        }
      });

      cols.forEach(col => grid.appendChild(col));
    });
  }


  /* ================================================================
     10. PRICE RANGE FILTER (live update label)
     ================================================================ */
  const priceRange = document.querySelector('input[name="price"]');
  if (priceRange) {
    const label = priceRange.previousElementSibling;
    const maxSpan = label?.querySelector('span:last-child');
    priceRange.addEventListener('input', function () {
      if (maxSpan) maxSpan.textContent = `Up to $${this.value}`;
    });
  }


  /* ================================================================
     11. CHECKOUT – form validation + payment toggle
     ================================================================ */
  const checkoutForm = document.querySelector('form[action="order-confirmation.html"]');
  if (checkoutForm) {
    // Toggle card fields visibility based on payment method
    const payRadios   = checkoutForm.querySelectorAll('[name="payment"]');
    const cardFields  = checkoutForm.querySelectorAll('#cardName, #cardNumber, #cardExp, #cardCvv');

    payRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const showCard = this.value === 'card';
        cardFields.forEach(field => {
          const wrapper = field.closest('.col-12, .col-6');
          if (wrapper) {
            wrapper.style.display = showCard ? '' : 'none';
            field.required = showCard;
          }
        });
      });
    });

    // Dynamic shipping cost update
    const deliveryRadios = checkoutForm.querySelectorAll('[name="delivery"]');
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const shippingCost = this.value === 'express' ? 9.00 : 5.00;
        const shippingDD = checkoutForm.querySelector('.summary-card dd:nth-of-type(2)');
        const totalDD    = checkoutForm.querySelector('.summary-card .total-row dd');
        const subtotalDD = checkoutForm.querySelector('.summary-card dd:first-of-type');

        if (shippingDD) shippingDD.textContent = '$' + shippingCost.toFixed(2);
        if (subtotalDD && totalDD) {
          const sub = parseFloat(subtotalDD.textContent.replace('$', ''));
          totalDD.textContent = '$' + (sub + shippingCost).toFixed(2);
        }
      });
    });

    // Form validation with Bootstrap classes
    checkoutForm.addEventListener('submit', function (e) {
      if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        showToast('Please fill in all required fields.', 'danger');
      }
      this.classList.add('was-validated');
    });
  }


  /* ================================================================
     12. SCROLL-TO-TOP BUTTON
     ================================================================ */
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'btn btn-primary btn-scroll-top';
  scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;width:48px;height:48px;border-radius:50%;display:none;z-index:1080;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;transition:opacity .3s';
  document.body.appendChild(scrollBtn);

  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.style.display = 'grid';
      scrollBtn.style.placeItems = 'center';
      requestAnimationFrame(() => scrollBtn.style.opacity = '1');
    } else {
      scrollBtn.style.opacity = '0';
      setTimeout(() => { if (window.scrollY <= 400) scrollBtn.style.display = 'none'; }, 300);
    }
  }, { passive: true });


  /* ================================================================
     13. DARK MODE TOGGLE
     ================================================================ */
  const darkToggle = document.createElement('button');
  darkToggle.className = 'btn btn-outline-primary btn-dark-toggle';
  darkToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
  darkToggle.setAttribute('aria-label', 'Toggle dark mode');
  darkToggle.style.cssText = 'position:fixed;bottom:5rem;right:1.5rem;width:48px;height:48px;border-radius:50%;z-index:1080;box-shadow:0 4px 12px rgba(0,0,0,.1);display:grid;place-items:center';
  document.body.appendChild(darkToggle);

  function applyDarkMode(dark) {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    darkToggle.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
    localStorage.setItem('kettle_dark', dark ? '1' : '0');
  }

  // Restore preference
  const savedDark = localStorage.getItem('kettle_dark');
  if (savedDark === '1') applyDarkMode(true);

  darkToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    applyDarkMode(!isDark);
  });


  /* ================================================================
     14. FAVOURITES / WISHLIST TOGGLE (product detail page)
     ================================================================ */
  document.querySelectorAll('[aria-label="Save to favourites"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const icon = this.querySelector('i');
      if (!icon) return;
      const isSaved = icon.classList.contains('bi-heart-fill');
      icon.classList.toggle('bi-heart', isSaved);
      icon.classList.toggle('bi-heart-fill', !isSaved);
      this.classList.toggle('btn-outline-primary', isSaved);
      this.classList.toggle('btn-primary', !isSaved);
      showToast(isSaved ? 'Removed from favourites.' : 'Saved to favourites! <i class="bi bi-heart-fill"></i>', isSaved ? 'info' : 'success');
    });
  });


  /* ================================================================
     15. QUANTITY STEPPER (product detail page)
     ================================================================ */
  document.querySelectorAll('input[name="qty"]').forEach(input => {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group qty-stepper';
    wrapper.style.width = '130px';

    const btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.className = 'btn btn-outline-primary';
    btnMinus.innerHTML = '<i class="bi bi-dash"></i>';

    const btnPlus = document.createElement('button');
    btnPlus.type = 'button';
    btnPlus.className = 'btn btn-outline-primary';
    btnPlus.innerHTML = '<i class="bi bi-plus"></i>';

    // Only apply stepper on the product detail page (not cart)
    if (input.closest('form[action="cart.html"]') && !input.closest('.cart-item')) {
      input.parentNode.insertBefore(wrapper, input);
      input.style.width = 'auto';
      wrapper.appendChild(btnMinus);
      wrapper.appendChild(input);
      wrapper.appendChild(btnPlus);

      btnMinus.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value) - 1);
        input.dispatchEvent(new Event('change'));
      });
      btnPlus.addEventListener('click', () => {
        input.value = Math.min(10, parseInt(input.value) + 1);
        input.dispatchEvent(new Event('change'));
      });
    }
  });


  /* ================================================================
     16. SMOOTH SCROLL for anchor links
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ================================================================
     17. SCROLL ANIMATIONS (fade-in on scroll)
     ================================================================ */
  const animateEls = document.querySelectorAll('.product-card, .cat-tile, .trust-item, .promo, .hero, .shop-banner');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateEls.forEach(el => {
      el.classList.add('animate-wait');
      observer.observe(el);
    });
  }


  /* ================================================================
     18. ACTIVE NAV LINK highlighting
     ================================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  /* ================================================================
     19. COUNTDOWN TIMER for promo section
     ================================================================ */
  const promoSection = document.querySelector('.promo');
  if (promoSection) {
    const timer = document.createElement('div');
    timer.className = 'promo-timer mt-3';
    timer.style.cssText = 'font-weight:700;font-size:1.1rem';
    promoSection.querySelector('.col-lg-8')?.appendChild(timer);

    function updateTimer() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      timer.innerHTML = `<i class="bi bi-clock me-1"></i>Offer ends in ${h}h ${m}m ${s}s`;
    }
    updateTimer();
    setInterval(updateTimer, 1000);
  }


  /* ================================================================
     20. PRODUCT IMAGE HOVER ZOOM (detail page)
     ================================================================ */
  const galleryMain = document.querySelector('.gallery-main');
  if (galleryMain) {
    galleryMain.style.cursor = 'zoom-in';
    galleryMain.addEventListener('click', function () {
      this.classList.toggle('gallery-zoomed');
      this.style.cursor = this.classList.contains('gallery-zoomed') ? 'zoom-out' : 'zoom-in';
    });
  }



  /* ================================================================
     21. QUICK VIEW MODAL (shop / category pages)
     ================================================================ */
  function createQuickViewModal() {
    if (document.getElementById('quickViewModal')) return;

    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body px-4 pb-4 pt-0">
            <div class="row g-4">
              <div class="col-md-5">
                <div id="qvArt" class="gallery-main" style="aspect-ratio:1/1;font-size:6rem;border-radius:16px"></div>
              </div>
              <div class="col-md-7">
                <p id="qvCat" class="product-cat mb-1"></p>
                <h3 id="qvName" class="h2 mb-2"></h3>
                <div id="qvStars" class="d-flex align-items-center gap-2 mb-3"></div>
                <p id="qvPrice" class="price fs-3 mb-3"></p>
                <div class="d-flex gap-2">
                  <a id="qvLink" class="btn btn-primary btn-lg flex-grow-1" href="#">View full details</a>
                  <button id="qvAddBtn" class="btn btn-outline-primary btn-lg"><i class="bi bi-bag-plus me-1"></i>Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  // Attach quick-view to product art clicks on listing pages
  document.querySelectorAll('.product-art').forEach(art => {
    // Add a quick-view eye icon overlay
    const eyeBtn = document.createElement('button');
    eyeBtn.type = 'button';
    eyeBtn.className = 'btn btn-sm btn-light quick-view-btn';
    eyeBtn.innerHTML = '<i class="bi bi-eye"></i>';
    eyeBtn.style.cssText = 'position:absolute;bottom:.75rem;right:.75rem;border-radius:50%;width:36px;height:36px;display:grid;place-items:center;opacity:0;transition:opacity .2s;z-index:2;padding:0';
    art.style.position = 'relative';
    art.appendChild(eyeBtn);

    eyeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      createQuickViewModal();

      const card = this.closest('.product-card');
      if (!card) return;

      const name  = card.querySelector('.product-name a')?.textContent || '';
      const cat   = card.querySelector('.product-cat')?.textContent || '';
      const price = card.querySelector('.price')?.textContent || '';
      const href  = card.querySelector('.product-name a')?.getAttribute('href') || '#';
      const stars = card.querySelector('.stars')?.outerHTML || '';
      const count = card.querySelector('.rating-count')?.outerHTML || '';
      const artBg = art.style.getPropertyValue('--art') || '#DCE7E0';
      const icon  = art.querySelector('i.bi')?.outerHTML || '';

      document.getElementById('qvName').textContent = name;
      document.getElementById('qvCat').textContent = cat;
      document.getElementById('qvPrice').textContent = price;
      document.getElementById('qvLink').href = href;
      document.getElementById('qvStars').innerHTML = stars + count;
      document.getElementById('qvArt').style.setProperty('--art', artBg);
      document.getElementById('qvArt').innerHTML = icon.replace(/font-size:[^;]*;?/, '');

      const modalEl = document.getElementById('quickViewModal');
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();

      // Quick-add button in modal
      document.getElementById('qvAddBtn').onclick = () => {
        const p = parseFloat(price.replace('$', ''));
        const id = href.replace('.html', '').replace('product-', '');
        Cart.add({ id, name, price: p, category: cat, size: '16oz', milk: 'Whole milk' });
        showToast(`<strong>${name}</strong> added to your cart!`);
        bsModal.hide();
      };
    });
  });


  /* ================================================================
     22. PRODUCT CARD HOVER EFFECTS (show quick-view button)
     ================================================================ */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const qvBtn = card.querySelector('.quick-view-btn');
      if (qvBtn) qvBtn.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      const qvBtn = card.querySelector('.quick-view-btn');
      if (qvBtn) qvBtn.style.opacity = '0';
    });
  });


  /* ================================================================
     23. KEYBOARD SHORTCUTS
     ================================================================ */
  document.addEventListener('keydown', function (e) {
    // Press "/" to focus search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      const search = document.querySelector('.nav-search input');
      if (search && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      }
    }
    // Press Escape to blur search
    if (e.key === 'Escape') {
      const search = document.querySelector('.nav-search input');
      if (search && document.activeElement === search) {
        search.blur();
      }
    }
  });


  /* ================================================================
     24. LOADING SKELETON on page transition
     ================================================================ */
  window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.6';
  });

  window.addEventListener('pageshow', () => {
    document.body.style.opacity = '1';
  });

})();
