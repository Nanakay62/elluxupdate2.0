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

// Used by new modal product cards (ponytail section)
// FIX: now uses getCart()/saveCart() and includes image + length fields
// so cart page renders correctly
function addToCartDirect(name, price) {
    let cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name,
            price: parseFloat(price),
            length: "Standard",
            qty: 1,
            image: '',          // no single image for modal products
            isBundle: false
        });
    }
    saveCart(cart);
    updateCartCount();

    // FIX: use the single unified toast (showLuxuryToast)
    // strip the "The Muse: " prefix for a cleaner message
    const shortName = name.split(':').pop().trim();
    showLuxuryToast(`${shortName} added to bag!`);
}

// ─────────────────────────────────────────────
// TOAST  (single unified system)
// ─────────────────────────────────────────────
function showLuxuryToast(message) {
    const toast   = document.getElementById('cart-toast');
    const toastMsg = document.getElementById('toast-msg');
    if (toast && toastMsg) {
        toastMsg.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
}

// ─────────────────────────────────────────────
// PRODUCT DATA  (modal ponytail cards)
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
        price: '€74.99',
        priceNum: 74.99,
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
            '18 inches — full, elegant length',
            'Natural blow-out finish',
            'Blends effortlessly with all textures',
            'Reusable and long-lasting',
        ],
        price: '€74.99',
        priceNum: 74.99,
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
        price: '€74.99',
        priceNum: 74.99,
        images: [
            'images/bodywavemain.jpeg',
            'images/bodywave1.jpeg',
            'images/bodywave2.jpeg',
            'images/bodywavecap.jpeg',
        ],
    },
};

// ─────────────────────────────────────────────
// MODAL  (all functions at global scope —
//         so onclick="openModal(...)" in HTML works)
// ─────────────────────────────────────────────
let currentProduct = null;
let activeIndex    = 0;

function openModal(key) {
    currentProduct = key;
    activeIndex    = 0;
    const p = products[key];
    if (!p) return;

    document.getElementById('modalEyebrow').textContent  = p.eyebrow;
    document.getElementById('modalTitle').innerHTML      = `<em>${p.title}</em> ${p.titleSuffix}`;
    document.getElementById('modalSubtitle').textContent = p.subtitle;
    document.getElementById('modalDesc').textContent     = p.desc;

    const ul = document.getElementById('modalFeatures');
    ul.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

    document.getElementById('modalPrice').textContent = p.price;
    document.getElementById('modalAddBtn').onclick =
        () => addToCartDirect(`${p.eyebrow}: ${p.title} ${p.titleSuffix}`, p.priceNum);

    buildGallery(p.images);

    document.getElementById('productModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function buildGallery(images) {
    const main   = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');

    // Remove previous images (leave arrow buttons intact)
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
    // FIX: query both .card-name (new cards) and .product-name (old cards)
    const searchBtn = document.getElementById('searchButton');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const term = document.getElementById('searchInput').value.toLowerCase().trim();
            document.querySelectorAll('.product-card').forEach(card => {
                // support both old (.product-name) and new (.card-name) card structures
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

        // Build dots
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

            // Play/pause video as it enters/leaves view
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

        // Touch / swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
        }, { passive: true });

        // Pause on hover
        const container = track.closest('.carousel-container') || track.parentElement;
        container.addEventListener('mouseenter', () => clearInterval(timer));
        container.addEventListener('mouseleave', startTimer);

        goTo(0);
    })(); // ← IIFE properly closed here

}); // ← DOMContentLoaded closed here