/* ============================================================
   cart.js  –  Ellen Luxe Hairs
   Handles rendering, qty changes, removal, totals & checkout
   ============================================================ */

const CART_KEY = 'ellenLuxeCart';

/* ── helpers ── */
function getCart()       { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart)  { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

/* ── qty change ── */
window.changeQty = function (index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    const newQty = (cart[index].qty || 1) + delta;
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].qty = newQty;
    }
    saveCart(cart);
    renderCart();
};

/* ── remove item ── */
window.removeItem = function (index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
};

/* ── go to checkout ── */
window.goToCheckout = function () {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Please add items to your bag before checking out.');
        return;
    }
    window.location.href = 'checkout.html';
};

/* ── main render ── */
function renderCart() {
    const cart         = getCart();
    const container    = document.getElementById('cartItems');
    const subtotalEl   = document.getElementById('cartTotal');
    const totalEl      = document.getElementById('cartFinalTotal');
    const badge        = document.getElementById('cartCount');
    const colHeaders   = document.getElementById('colHeaders');
    const promoStrip   = document.getElementById('promoStrip');
    const countLabel   = document.getElementById('itemCountLabel');

    if (!container) return;

    /* ── Empty state ── */
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-msg-container">
                <svg class="empty-bag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p class="empty-msg">Your bag is empty</p>
                <p class="empty-sub">Discover our collection of luxury hair pieces</p>
                <a href="index.html" class="shop-link">Shop Now</a>
            </div>`;

        if (subtotalEl)  subtotalEl.textContent  = '€0.00';
        if (totalEl)     totalEl.textContent      = '€0.00';
        if (badge)       badge.textContent        = '0';
        if (colHeaders)  colHeaders.style.display = 'none';
        if (promoStrip)  promoStrip.classList.remove('visible');
        if (countLabel)  countLabel.textContent   = '';
        return;
    }

    /* ── Show column headers on desktop ── */
    if (colHeaders) colHeaders.style.display = '';

    /* ── Build rows ── */
    let subtotal    = 0;
    let totalQty    = 0;
    let hasPonytail = false;

    container.innerHTML = cart.map((item, index) => {
        const qty       = item.qty || 1;
        const lineTotal = item.price * qty;
        subtotal       += lineTotal;
        totalQty       += qty;

        if (item.name.toLowerCase().includes('ponytail')) hasPonytail = true;

        return `
        <div class="cart-item-row">
            <!-- Thumbnail -->
            <div class="cart-item-thumb">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"
                     stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                    <path d="M8 12h8M12 8v8"/>
                </svg>
            </div>

            <!-- Name + meta -->
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-meta">
                    ${item.length ? item.length + '" Length' : 'One Size'}
                    &nbsp;·&nbsp; €${item.price.toFixed(2)} each
                </span>
            </div>

            <!-- Per-unit price (desktop column) -->
            <div class="item-unit-price">€${item.price.toFixed(2)}</div>

            <!-- Qty stepper -->
            <div class="item-controls">
                <div class="qty-selector">
                    <button onclick="changeQty(${index}, -1)" aria-label="Decrease quantity">−</button>
                    <span class="qty-val">${qty}</span>
                    <button onclick="changeQty(${index}, 1)" aria-label="Increase quantity">+</button>
                </div>
            </div>

            <!-- Line total -->
            <div class="item-price">€${lineTotal.toFixed(2)}</div>

            <!-- Remove -->
            <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove ${item.name}">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
            </button>
        </div>`;
    }).join('');

    /* ── Promo ── */
    if (promoStrip) {
        hasPonytail
            ? promoStrip.classList.add('visible')
            : promoStrip.classList.remove('visible');
    }

    /* ── Totals ── */
    if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    if (totalEl)    totalEl.textContent    = `€${subtotal.toFixed(2)}`;
    if (badge)      badge.textContent      = String(totalQty);

    /* ── Item count label ── */
    if (countLabel) {
        const itemWord = totalQty === 1 ? 'item' : 'items';
        countLabel.textContent = `${totalQty} ${itemWord} in your bag`;
    }
}

/* ── init ── */
document.addEventListener('DOMContentLoaded', renderCart);