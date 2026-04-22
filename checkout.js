const CART_KEY  = 'ellenLuxeCart';
const SHEET_URL = 'https://api.sheetbest.com/sheets/7695b621-65c6-4f5e-8b92-7c185bca7526';
const FORMSPREE = 'https://formspree.io/f/mlgwrnej';

let cart        = JSON.parse(localStorage.getItem(CART_KEY)) || [];
let totalAmount = 0;

/* ── SAVE CART ── */
function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ── SUMMARY TOGGLE (mobile) ── */
function toggleSummary() {
    const btn    = document.getElementById('orderToggle');
    const panel  = document.getElementById('summaryPanel');
    const isOpen = panel.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.querySelector('.order-toggle-left').childNodes[2].textContent =
        isOpen ? ' Hide order summary' : ' Show order summary';
}

/* ── CHANGE QUANTITY ── */
window.changeQty = function (index, delta) {
    if (!cart[index]) return;
    const newQty = (cart[index].qty || 1) + delta;
    if (newQty <= 0) {
        removeItem(index);
    } else {
        cart[index].qty = newQty;
        saveCart();
        renderSummary();
    }
};

/* ── REMOVE ITEM ── */
window.removeItem = function (index) {
    cart.splice(index, 1);
    saveCart();
    renderSummary();
};

/* ── RENDER SUMMARY ── */
function renderSummary() {
    const list       = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('subtotal-val');
    const totalEl    = document.getElementById('total-val');
    const toggleAmt  = document.getElementById('toggle-total');
    const promo      = document.getElementById('promo-notice');

    if (cart.length === 0) {
        list.innerHTML = `<div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
            </svg>
            <p>Your cart is empty.</p>
        </div>`;
        subtotalEl.textContent = '€0.00';
        totalEl.textContent    = '€0.00';
        toggleAmt.textContent  = '€0.00';
        if (promo) promo.classList.remove('visible');
        return;
    }

    totalAmount = 0;
    let hasPonytail = false;

    list.innerHTML = cart.map((item, index) => {
        const qty       = item.qty || 1;
        const lineTotal = item.price * qty;
        totalAmount    += lineTotal;
        if (item.name.toLowerCase().includes('ponytail')) hasPonytail = true;

        return `
        <div class="order-line" data-index="${index}">
            <div class="order-line-img">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
                    <path d="M12 8v8M8 12h8"/>
                </svg>
            </div>
            <div class="order-line-info">
                <div class="order-line-name">${item.name}</div>
                <div class="order-line-meta">${item.length ? item.length + '" length' : ''}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)" aria-label="Decrease quantity">−</button>
                    <span class="qty-value">${qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)" aria-label="Increase quantity">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove item">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
            <div class="order-line-price">€${lineTotal.toFixed(2)}</div>
        </div>`;
    }).join('');

    if (promo) {
        hasPonytail ? promo.classList.add('visible') : promo.classList.remove('visible');
    }

    subtotalEl.textContent = `€${totalAmount.toFixed(2)}`;
    totalEl.textContent    = `€${totalAmount.toFixed(2)}`;
    toggleAmt.textContent  = `€${totalAmount.toFixed(2)}`;
}

/* ── VALIDATION ── */
function validateFields() {
    const required = ['email', 'phone', 'fname', 'lname', 'address', 'city'];
    const empty = required.filter(id => !document.getElementById(id).value.trim());
    if (empty.length) {
        empty.forEach(id => {
            const el = document.getElementById(id);
            el.style.borderColor = '#e53935';
            el.addEventListener('input', () => el.style.borderColor = '', { once: true });
        });
        document.getElementById(empty[0]).focus();
        return false;
    }
    return true;
}

/* ── PROCESS ORDER ── */
async function processOrder(method, transactionId = 'N/A') {
    if (!validateFields()) {
        if (method !== 'PayPal') alert('Please fill in all required fields.');
        return false;
    }

    const get = id => document.getElementById(id).value.trim();
    const apartment = get('apartment');

    let itemsString = cart.map(i => `${i.name} (${i.length || 'N/A'}") x${i.qty || 1}`).join(', ');
    if (itemsString.toLowerCase().includes('ponytail')) itemsString += ' + FREE SCRUNCHIE';

    const orderData = {
        date:          new Date().toLocaleString(),
        customerName:  `${get('fname')} ${get('lname')}`,
        email:         get('email'),
        phone:         get('phone'),
        address:       `${get('address')}${apartment ? ', ' + apartment : ''}, ${get('city')}`,
        postalCode:    get('zip') || 'N/A',
        items:         itemsString,
        totalAmount:   `€${totalAmount.toFixed(2)}`,
        paymentMethod: method,
        status:        method === 'PayPal' ? 'Paid' : 'Pending',
        paypalId:      transactionId
    };

    try {
        const [sheetRes, emailRes] = await Promise.all([
            fetch(SHEET_URL, {
                method: 'POST', mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([orderData])
            }),
            fetch(FORMSPREE, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
        ]);

        if (sheetRes.ok || emailRes.ok) {
            localStorage.removeItem(CART_KEY);
            window.location.href = 'success.html';
        } else {
            throw new Error('Services failed');
        }
    } catch (err) {
        console.error(err);
        alert('Connection error. If payment was completed, please contact @EllenLuxeHairs on Instagram.');
    }
}

/* ── PAY ON DELIVERY ── */
window.handlePOD = function () {
    if (!validateFields()) { alert('Please fill in all required fields.'); return; }
    if (confirm('Confirm your order for Pay on Delivery?')) processOrder('Pay on Delivery');
};

/* ── PAYPAL ── */
paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 48 },
    onClick: function (data, actions) {
        if (!validateFields()) {
            alert('Please fill in your shipping and contact details first.');
            return actions.reject();
        }
        return actions.resolve();
    },
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{ amount: { value: totalAmount.toFixed(2), currency_code: 'EUR' } }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(details => processOrder('PayPal', details.id));
    }
}).render('#paypal-button-container');

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', renderSummary);