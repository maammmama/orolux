document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Add click handler for Add to Cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(productId);
        });
    }

    // Load product details
    function loadProductDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);

        if (!product) {
            window.location.href = '/my-watch-colne/frontend/src/views/store/product.html';
            return;
        }

        // Update basic information
        document.querySelector('.product-info h1').textContent = product.name;
        document.querySelector('.product-reference').textContent = `Reference ${product.sku || ''}`;
        document.querySelector('.product-price').textContent = 
            product.discountPrice ? 
            `${product.discountPrice} MAD (Was ${product.price} MAD)` : 
            `${product.price} MAD`;

        // Update product description
        document.querySelector('.product-description').innerHTML = product.details || '';

        // Update specifications
        const specs = document.querySelector('.specs');
        specs.innerHTML = `
            <div class="spec-row">
                <span class="spec-label">Diameter</span>
                <span class="spec-value">${product.specifications?.movement || 'N/A'}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Height</span>
                <span class="spec-value">${product.specifications?.caseMaterial || 'N/A'}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Movement</span>
                <span class="spec-value">${product.specifications?.dialColor || 'N/A'}</span>
            </div>
            <div class="spec-row">
                <span class="spec-label">Water Resistance</span>
                <span class="spec-value">${product.specifications?.waterResistance || 'N/A'}</span>
            </div>
        `;

        // Update images
        const mainImage = document.querySelector('.main-image img');
        mainImage.src = product.mainImage;
        mainImage.alt = product.name;

        // Update thumbnails
        const thumbnailGrid = document.querySelector('.thumbnail-grid');
        thumbnailGrid.innerHTML = `
            <div class="thumbnail active">
                <img src="${product.mainImage}" alt="${product.name} - Main">
            </div>
            ${product.galleryImages ? product.galleryImages.map(img => `
                <div class="thumbnail">
                    <img src="${img}" alt="${product.name}">
                </div>
            `).join('') : ''}
        `;

        // Update tab contents
        document.getElementById('details').innerHTML = product.details || 'No details available';
        document.getElementById('technical').innerHTML = `
            <div class="technical-content">
                ${product.technicalData || ''}
                <h3>Specifications</h3>
                <ul class="tech-specs">
                    <li><strong>Diameter:</strong> ${product.specifications?.movement || 'N/A'}</li>
                    <li><strong>Height:</strong> ${product.specifications?.caseMaterial || 'N/A'}</li>
                    <li><strong>Movement:</strong> ${product.specifications?.dialColor || 'N/A'}</li>
                    <li><strong>Water Resistance:</strong> ${product.specifications?.waterResistance || 'N/A'}</li>
                </ul>
            </div>
        `;

        // Add thumbnail click handlers
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.querySelector('img').src;
            });
        });
    }
    
    loadProductDetails();

    // Add quantity controls
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                // Update order summary if visible
                updateOrderSummary();
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
            // Update order summary if visible
            updateOrderSummary();
        });

        quantityInput.addEventListener('change', () => {
            if (parseInt(quantityInput.value) < 1) {
                quantityInput.value = 1;
            }
            // Update order summary if visible
            updateOrderSummary();
        });
    }
});

function addToCart(productId) {
    if (!productId) {
        console.error('No product ID provided');
        return;
    }

    // Initialize cart manager if not exists
    if (typeof window.cartManager === 'undefined') {
        window.cartManager = new CartManager();
    }
    
    // Get product details from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Product not found with ID:", productId);
        return;
    }
    
    // Add to cart
    window.cartManager.addToCart(product);

    // Show success notification
    showNotification(product.name + ' added to cart');
}

function showNotification(message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-check"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-actions">
            <a href="/my-watch-colne/frontend/src/views/store/checkout.html" class="view-cart-btn">
                View Cart
            </a>
        </div>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('active');
    });

    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto dismiss after 3 seconds
    const dismissTimeout = setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);

    // Clear timeout if manually closed
    notification.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutDrawer = document.getElementById('checkout-drawer');
    const closeDrawerBtn = document.querySelector('.close-drawer');
    
    // Handle checkout button click
    checkoutBtn.addEventListener('click', function() {
        // Get current product details
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);

        if (product) {
            updateOrderSummary(product);
        }

        checkoutDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Handle close drawer button click
    closeDrawerBtn.addEventListener('click', function() {
        checkoutDrawer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close drawer when clicking outside
    checkoutDrawer.addEventListener('click', function(e) {
        if (e.target === checkoutDrawer) {
            checkoutDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add this tab switching code
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Update summary when quantity changes
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const product = products.find(p => p.id === productId);

            if (product) {
                updateOrderSummary(product);
            }
        });
    }
});

// Add this function after your existing code
function updateOrderSummary(product) {
    const summaryContent = document.querySelector('.summary-content');
    const summaryTotal = document.querySelector('.summary-total');
    
    if (summaryContent && summaryTotal) {
        // Get selected quantity (default to 1 if not specified)
        const quantity = parseInt(document.getElementById('quantity')?.value || 1);
        
        // Calculate total
        const price = product.discountPrice || product.price;
        const total = price * quantity;

        // Render summary
        summaryContent.innerHTML = `
            <div class="summary-item">
                <div class="item-details">
                    <h4>${product.name}</h4>
                    <p>Quantity: ${quantity}</p>
                    <p>Price: ${price} MAD</p>
                </div>
            </div>
        `;

        summaryTotal.innerHTML = `
            <div class="total-line">
                <span>Total:</span>
                <span>${total.toFixed(2)} MAD</span>
            </div>
        `;
    }
}

// Modify your existing checkoutBtn click handler
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutDrawer = document.getElementById('checkout-drawer');
    const closeDrawerBtn = document.querySelector('.close-drawer');
    
    // Handle checkout button click
    checkoutBtn.addEventListener('click', function() {
        // Get current product details
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);

        if (product) {
            updateOrderSummary(product);
        }

        checkoutDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Handle close drawer button click
    closeDrawerBtn.addEventListener('click', function() {
        checkoutDrawer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close drawer when clicking outside
    checkoutDrawer.addEventListener('click', function(e) {
        if (e.target === checkoutDrawer) {
            checkoutDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add this tab switching code
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Remove the duplicate event listeners and use only one form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const deliveryForm = document.querySelector('.delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get product details from the page
            const productName = document.querySelector('.product-info h1').textContent;
            const quantity = document.querySelector('#quantity').value;
            const price = document.querySelector('.product-price').textContent.replace('MAD', '').trim();
            const total = parseFloat(price) * parseInt(quantity);

            // Create order object
            const order = {
                orderDate: new Date().toISOString(),
                productName: productName,
                quantity: quantity,
                price: price,
                total: total,
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Show success message and close drawer
            alert('Order placed successfully!');
            document.getElementById('checkout-drawer').classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});
