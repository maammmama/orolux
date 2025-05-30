class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.init();
    }

    init() {
        this.updateCartUI();
        this.addEventListeners();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.mainImage || product.image || '/my-watch-colne/frontend/src/images/products/arrival-1.png',
                quantity: 1,
                size: '38mm'
            });
        }
        this.saveCart();
        this.updateCartUI();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => String(item.id) !== String(productId));
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => String(item.id) === String(productId));
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';

        this.cart.forEach(item => {
            if (!item) return;
            const cartItemHTML = `
                <div class="cart_item" data-product-id="${item.id}">
                    <div class="detail-value">${item.name}</div>
                    <div class="detail-value">${item.price} MAD</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-button">Remove</button>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        this.updateTotal();
    }

    updateTotal() {
        let total = 0;
        this.cart.forEach(item => {
            total += (item.price || 0) * (item.quantity || 1);
        });

        const totalElement = document.querySelector('.total_price h3');
        if (totalElement) {
            totalElement.textContent = `Total Price: ${total.toFixed(2)} MAD`;
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addEventListeners() {
        const cartContainer = document.getElementById('cart-items');
        if (cartContainer) {
            cartContainer.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart_item');
                if (!cartItem) return;
                const productId = cartItem.dataset.productId;

                // Remove button
                if (e.target.classList.contains('remove-button')) {
                    this.removeFromCart(productId);
                }

                // Plus button
                if (e.target.classList.contains('plus')) {
                    const input = cartItem.querySelector('.quantity-input');
                    let qty = parseInt(input.value, 10) || 1;
                    qty += 1;
                    this.updateQuantity(productId, qty);
                }

                // Minus button
                if (e.target.classList.contains('minus')) {
                    const input = cartItem.querySelector('.quantity-input');
                    let qty = parseInt(input.value, 10) || 1;
                    if (qty > 1) {
                        qty -= 1;
                        this.updateQuantity(productId, qty);
                    }
                }
            });

            // Direct input change
            cartContainer.addEventListener('change', (e) => {
                if (e.target.classList.contains('quantity-input')) {
                    const cartItem = e.target.closest('.cart_item');
                    if (!cartItem) return;
                    const productId = cartItem.dataset.productId;
                    let qty = parseInt(e.target.value, 10) || 1;
                    if (qty < 1) qty = 1;
                    this.updateQuantity(productId, qty);
                }
            });
        }
    }

    getCartItems() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }
}

// Initialize cart manager
window.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.querySelector('.checkout_button');
    const orderSidebar = document.getElementById('orderSidebar');
    const closeOrderButton = document.querySelector('.close-order-sidebar');
    const orderOverlay = document.getElementById('orderOverlay');
    const orderForm = document.querySelector('.order-form');
    const supportQuestion = document.getElementById('supportToggle');

    // Show support question by default if it exists
    if (supportQuestion) {
        supportQuestion.style.display = 'block';
    }

    function populateOrderForm() {
        const cartItems = cartManager.getCartItems();
        let orderSummaryHTML = '';

        cartItems.forEach(item => {
            orderSummaryHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>Size: ${item.size || '38mm'}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: ${(item.price * item.quantity).toFixed(2)} MAD</p>
                    </div>
                </div>
            `;
        });

        // Add order summary to sidebar
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        orderSummary.innerHTML = `
            <h3>Order Summary</h3>
            ${orderSummaryHTML}
            <div class="order-total">
                <strong>Total:</strong> $${cartManager.getTotal().toFixed(2)}
            </div>
        `;

        // Insert order summary before the form
        const existingSummary = orderSidebar.querySelector('.order-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        orderForm.insertAdjacentElement('beforebegin', orderSummary);

        // Update form quantity and size
        if (cartItems.length > 0) {
            const firstItem = cartItems[0];
            const quantityInput = orderForm.querySelector('input[name="quantity"]');
            const sizeSelect = orderForm.querySelector('select[name="size"]');

            if (quantityInput) quantityInput.value = firstItem.quantity;
            if (sizeSelect) {
                const sizeOption = Array.from(sizeSelect.options).find(
                    option => option.value === firstItem.size
                );
                if (sizeOption) sizeOption.selected = true;
            }
        }
    }

    function openOrderSidebar() {
        orderSidebar.classList.add('active');
        orderOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (supportQuestion) {
            supportQuestion.style.display = 'none';
        }
        // Populate form when opening sidebar
        populateOrderForm();
    }

    function closeOrderSidebar() {
        orderSidebar.classList.remove('active');
        orderOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Show support question when closing the order sidebar
        if (supportQuestion) {
            supportQuestion.style.display = 'block';
        }
    }

    // Event listeners for checkout sidebar
    checkoutButton.addEventListener('click', function() {
        openOrderSidebar();
    });
    closeOrderButton.addEventListener('click', function() {
        closeOrderSidebar();
    });
    orderOverlay.addEventListener('click', closeOrderSidebar);

    // Handle form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get cart items
        const cartItems = cartManager.getCartItems();
        const total = cartManager.getTotal();
        
        // Create order object
        const order = {
            orderDate: new Date().toISOString(),
            products: cartItems.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size
            })),
            firstName: this.querySelector('[name="first-name"]').value,
            lastName: this.querySelector('[name="last-name"]').value,
            address: this.querySelector('[name="address"]').value,
            city: this.querySelector('[name="city"]').value,
            phone: this.querySelector('[name="phone"]').value,
            email: this.querySelector('[name="email"]').value,
            message: this.querySelector('[name="message"]')?.value || '',
            total: total
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart after successful order
        cartManager.cart = [];
        cartManager.saveCart();
        cartManager.updateCartUI();

        // Close sidebar and show confirmation
        closeOrderSidebar();
        alert('Order placed successfully!');
    });
});

// Add this function to render the order summary
function renderOrderSummary() {
    const summaryContent = document.querySelector('.summary-content');
    const summaryTotal = document.querySelector('.summary-total');
    
    if (!summaryContent || !summaryTotal) return;

    const cartItems = window.cartManager.getCartItems();
    const total = window.cartManager.getTotal();

    // Generate HTML for cart items
    const itemsHtml = cartItems.map(item => `
        <div class="summary-item mb-4">
            <h4 class="font-medium">${item.name}</h4>
            <p class="text-gray-600">Quantity: ${item.quantity}</p>
            <p class="text-gray-600">Price: ${item.price} MAD × ${item.quantity}</p>
            <p class="text-gray-600">Subtotal: ${(item.price * item.quantity).toFixed(2)} MAD</p>
        </div>
    `).join('');

    // Update summary content
    summaryContent.innerHTML = itemsHtml;
    
    // Update total
    summaryTotal.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="font-semibold">Total:</span>
            <span class="font-semibold">${total.toFixed(2)} MAD</span>
        </div>
    `;
}

// Update the checkout button click handler
const checkoutBtn = document.querySelector('.checkout_button');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        const cartItems = window.cartManager.getCartItems();
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Show the drawer and render summary
        const drawer = document.getElementById('checkout-drawer');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderOrderSummary();
    });
}

// Close drawer handlers
document.querySelector('.close-drawer').addEventListener('click', function() {
    document.getElementById('checkout-drawer').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Form submission
document.querySelector('.delivery-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get cart items with their names
    const cartItems = window.cartManager.getCartItems();
    const total = window.cartManager.getTotal();

    // Create order object with product name and quantity from cart
    const order = {
        orderDate: new Date().toISOString(),
        productName: cartItems[0]?.name || 'Unknown Product',
        // Get quantity from cart item
        quantity: cartItems[0]?.quantity || 1,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        // Include cart items details
        items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size
        })),
        total: total
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    window.cartManager.clearCart();
    
    // Close drawer and show confirmation
    document.getElementById('checkout-drawer').classList.remove('active');
    document.body.style.overflow = '';
    alert('Order placed successfully!');
});

// Update quantity listeners to refresh summary
document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('cart-items');
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('quantity-btn')) {
                setTimeout(renderOrderSummary, 100); // Update summary after quantity change
            }
        });

        cartContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                setTimeout(renderOrderSummary, 100); // Update summary after manual quantity input
            }
        });
    }
});
