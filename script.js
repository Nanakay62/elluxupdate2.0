const CART_KEY = "ellenLuxeCart";

// ─────────────────────────────────────────────
// CART HELPERS
// ─────────────────────────────────────────────
function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cartCount');
    if (el) el.innerText = count;
}

// Used by old product cards (accessories, sale page, etc.)
function handleAddToCart(button, name, price, isAccessory = false, isSale = false) {
    const card = button.closest('.product-card');
    const selectedLength = isAccessory ? "Standard" : (card.querySelector('.length-selector')?.value || "18");

    let cart = getCart();
    const existing = cart.find(item => item.name === name && item.length === selectedLength);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name,
            price: parseFloat(price),
            length: selectedLength,
            qty: 1,
            image: card.querySelector('img')?.src || '',
            isBundle: isSale
        });
    }

    saveCart(cart);
    updateCartCount();
    showLuxuryToast(`${name} added to bag!`);

    const originalText = button.innerText;
    button.innerText = "Added ✓";
    button.style.background = "#d4af37";
    button.disabled = true;
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = "#000";
        button.disabled = false;
    }, 2000);
}

// ─────────────────────────────────────────────
// ADD TO CART  (modal & quick-add)
// ─────────────────────────────────────────────
function addToCartDirect(name, price, length) {
    const lengthLabel = length || "Standard";
    let cart = getCart();
    const existing = cart.find(i => i.name === name && i.length === lengthLabel);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name,
            price: parseFloat(price),
            length: lengthLabel,
            qty: 1,
            image: '',
            isBundle: false
        });
    }
    saveCart(cart);
    updateCartCount();

    const shortName = name.split(':').pop().trim();
    showLuxuryToast(`${shortName} (${lengthLabel}) added to bag!`);
}

// Called by the "Add to Cart" button on product cards
// Opens a small length-picker popover if the product has multiple lengths,
// or adds directly if there is only one length.
function quickAddFromCard(event, key) {
    event.stopPropagation(); // prevent card click opening modal

    const p = products[key];
    if (!p) return;

    if (p.lengths.length === 1) {
        // Only one option — add straight to cart
        const opt = p.lengths[0];
        addToCartDirect(`${p.eyebrow}: ${p.title} ${p.titleSuffix}`, opt.price, opt.label);
        // Visual feedback on the button
        const btn = event.currentTarget;
        const orig = btn.innerText;
        btn.innerText = "Added ✓";
        btn.style.background = "#d4af37";
        btn.disabled = true;
        setTimeout(() => {
            btn.innerText = orig;
            btn.style.background = "";
            btn.disabled = false;
        }, 2000);
    } else {
        // Multiple lengths — open modal so customer can choose
        openModal(key);
    }
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function showLuxuryToast(message) {
    const toast    = document.getElementById('cart-toast');
    const toastMsg = document.getElementById('toast-msg');
    if (toast && toastMsg) {
        toastMsg.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
}

// ─────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────
const products = {
    'kinky-curly': {
        eyebrow: 'The Muse',
        title: 'Kinky Curly',
        titleSuffix: 'Ponytail',
        subtitle: 'Light & fluffy everyday glam',
        desc: 'The Muse Kinky Curly is crafted for women who want volume, bounce, and undeniable presence. Each strand is soft to the touch with defined, springy curls that move naturally with you — from morning to night.',
        features: [
            '100% Human Hair',
            'Light and fluffy with soft volume',
            'Reusable and long-lasting',
            'Everyday glam — effortless to style',
            '200 density for maximum fullness',
        ],
        // Single price for this texture
        lengths: [
            { label: '18 inches', price: 69.99 },
        ],
        images: [
            'images/kinkycurlymain.jpeg',
            'images/kinkycurly1.jpeg',
            'images/kinkycurlycap.jpeg',
        ],
    },
    'kinky-straight': {
        eyebrow: 'The Muse',
        title: 'Kinky Straight',
        titleSuffix: 'Ponytail',
        subtitle: 'Sleek blow-out, effortless blend',
        desc: 'The Muse Kinky Straight delivers the polished, blown-out look you love — smooth, aligned, and seamlessly blending with your natural hair texture. Ready in seconds, lasting all day.',
        features: [
            '100% Human Hair',
            'Natural blow-out finish',
            'Blends effortlessly with all textures',
            'Reusable and long-lasting',
        ],
        // Two lengths at different prices
        lengths: [
            { label: '10 inches', price: 64.99 },
            { label: '12 inches', price: 69.99 },
        ],
        images: [
            'images/kinkystraightmain.jpeg',
            'images/kinkystraight1.jpeg',
            'images/kinkystraight2.jpeg',
            'images/kinkystraightcap.jpeg',
        ],
    },
    'body-wave': {
        eyebrow: 'Soft Luxury',
        title: 'Body Wave',
        titleSuffix: 'Ponytail',
        subtitle: 'Timeless elegance, natural movement',
        desc: 'Soft Luxury Body Wave is everything you need for a refined, effortless look. Flowing, natural waves cascade with life and shine — ready in seconds, stunning all day.',
        features: [
            '100% Human Hair',
            'Effortless movement and natural shine',
            'Soft and luxurious feel',
            'Ready in seconds',
            'Reusable and long-lasting',
        ],
        lengths: [
            { label: '18 inches', price: 69.99 },
        ],
        images: [
            'images/bodywavemain.jpeg',
            'images/bodywave1.jpeg',
            'images/bodywave2.jpeg',
            'images/bodywavecap.jpeg',
        ],
    },
};

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
let currentProduct  = null;
let activeIndex     = 0;
let selectedLengthIndex = 0;

function openModal(key) {
    currentProduct = key;
    activeIndex    = 0;
    selectedLengthIndex = 0;

    const p = products[key];
    if (!p) return;

    document.getElementById('modalEyebrow').textContent  = p.eyebrow;
    document.getElementById('modalTitle').innerHTML      = `<em>${p.title}</em> ${p.titleSuffix}`;
    document.getElementById('modalSubtitle').textContent = p.subtitle;
    document.getElementById('modalDesc').textContent     = p.desc;

    const ul = document.getElementById('modalFeatures');
    ul.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

    // Build length selector chips
    buildLengthOptions(p);

    // Set initial price
    updateModalPrice(p, 0);

    // Wire up Add to Bag
    document.getElementById('modalAddBtn').onclick = () => {
        const opt = p.lengths[selectedLengthIndex];
        addToCartDirect(`${p.eyebrow}: ${p.title} ${p.titleSuffix}`, opt.price, opt.label);
    };

    buildGallery(p.images);

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function buildLengthOptions(p) {
    const container = document.getElementById('modalLengths');
    if (!container) return;
    container.innerHTML = '';

    p.lengths.forEach((opt, i) => {
        const chip = document.createElement('button');
        chip.className = 'length-chip' + (i === 0 ? ' active' : '');
        chip.textContent = opt.label;
        chip.addEventListener('click', () => {
            container.querySelectorAll('.length-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedLengthIndex = i;
            updateModalPrice(p, i);
        });
        container.appendChild(chip);
    });
}

function updateModalPrice(p, index) {
    const priceEl = document.getElementById('modalPrice');
    if (priceEl) {
        priceEl.textContent = `€${p.lengths[index].price.toFixed(2)}`;
    }
}

function buildGallery(images) {
    const main   = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');

    main.querySelectorAll('img').forEach(el => el.remove());
    thumbs.innerHTML = '';

    images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Product view ${i + 1}`;
        if (i === 0) img.classList.add('active');
        main.appendChild(img);

        const div  = document.createElement('div');
        div.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
        div.onclick   = () => setGalleryIndex(i);
        const tImg = document.createElement('img');
        tImg.src = src;
        tImg.alt = `Thumb ${i + 1}`;
        div.appendChild(tImg);
        thumbs.appendChild(div);
    });
}

function setGalleryIndex(idx) {
    const main   = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');
    const imgs   = main.querySelectorAll('img');
    const tDivs  = thumbs.querySelectorAll('.gallery-thumb');

    imgs[activeIndex].classList.remove('active');
    tDivs[activeIndex].classList.remove('active');
    activeIndex = (idx + imgs.length) % imgs.length;
    imgs[activeIndex].classList.add('active');
    tDivs[activeIndex].classList.add('active');
}

function shiftGallery(dir) {
    const total = document.getElementById('galleryMain').querySelectorAll('img').length;
    setGalleryIndex(activeIndex + dir);
}

function closeModal() {
    document.getElementById('productModal').classList.remove('open');
    document.body.style.overflow = '';
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('productModal')) closeModal();
}

// ─────────────────────────────────────────────
// DOM READY
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // ── Mobile menu ──
    const menuBtn = document.getElementById('mobileMenuToggle');
    const nav     = document.querySelector('.main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // ── Search ──
    const searchBtn = document.getElementById('searchButton');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const term = document.getElementById('searchInput').value.toLowerCase().trim();
            document.querySelectorAll('.product-card').forEach(card => {
                const nameEl = card.querySelector('.card-name') || card.querySelector('.product-name');
                const title  = nameEl ? nameEl.innerText.toLowerCase() : '';
                card.style.display = (!term || title.includes(term)) ? '' : 'none';
            });
        });
    }

    // ── Escape key closes modal ──
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // ── Carousel ──
    (function () {
        const track    = document.getElementById('carouselTrack');
        const prevBtn  = document.getElementById('prevSlide');
        const nextBtn  = document.getElementById('nextSlide');
        const dotsWrap = document.getElementById('carouselIndicators');

        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const total  = slides.length;
        let current  = 0;
        let timer    = null;
        const AUTO_DELAY = 5500;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        function getDots() {
            return Array.from(dotsWrap.querySelectorAll('.carousel-dot'));
        }

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            getDots().forEach((d, i) => d.classList.toggle('active', i === current));

            slides.forEach((slide, i) => {
                const vid = slide.querySelector('video');
                if (!vid) return;
                if (i === current) { vid.play().catch(() => {}); }
                else               { vid.pause(); }
            });

            resetTimer();
        }

        function startTimer() { timer = setInterval(() => goTo(current + 1), AUTO_DELAY); }
        function resetTimer() { clearInterval(timer); startTimer(); }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        }, { passive: true });

        const container = track.closest('.carousel-container') || track.parentElement;
        container.addEventListener('mouseenter', () => clearInterval(timer));
        container.addEventListener('mouseleave', startTimer);

        goTo(0);
    })();

});