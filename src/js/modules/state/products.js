const productsData = {
    "blok38": [
        {
            id: 1,
            name: "Blok 38 - Black",
            price: 379.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok38"
        },
        {
            id: 2,
            name: "Blok 38 - Discommon Edition",
            price: 429.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok38"
        },
        {
            id: 3,
            name: "Blok 38 - Glow",
            price: 429.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok38"
        },
        {
            id: 4,
            name: "Blok 38 - Grey",
            price: 379.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok38"
        }
    ],
    "blok31": [
        {
            id: 5,
            name: "Blok 31 - Classic",
            price: 299.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok31"
        }
    ],
    "blok33": [
        {
            id: 6,
            name: "Blok 33 - Sport",
            price: 349.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "blok33"
        }
    ],
    "accessories": [
        {
            id: 7,
            name: "Watch Strap - Leather",
            price: 49.00,
            image: "/my-watch-colne/frontend/src/images/products/arrival-1.png",
            collection: "accessories"
        }
    ]
};

// Function to create product card HTML
function createProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center product-card">
            <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" class="product-link">
                <img src="${product.mainImage}" 
                     alt="${product.name}" 
                     class="mb-4 w-64 h-64 object-contain">
                <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                <p class="text-gray-500 text-base mb-2">
                    ${product.discountPrice ? 
                        `<span class="line-through mr-2">${product.price} MAD</span>
                         <span class="text-red-500">${product.discountPrice} MAD</span>` 
                        : `${product.price} MAD`}
                </p>
            </a>
            <div class="mt-4 flex gap-2 w-full">
                <button 
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors add-to-cart-btn"
                    data-product-id="${product.id}"
                >
                    Add to Cart
                </button>
                <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" 
                   class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-center">
                    View Details
                </a>
            </div>
        </div>
    `;
}

// Add to cart functionality
function addToCart(productId) {
    // Get product details from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Initialize cart manager if not exists
    if (typeof window.cartManager === 'undefined') {
        window.cartManager = new CartManager();
    }
    
    // Add to cart using cart manager
    window.cartManager.addToCart(product);
    
    // Show success notification
    showNotification(`${product.name} added to cart`);
}

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to update products display
function updateProductDisplay(collection) {
    const productGrid = document.getElementById('product-grid');
    const collectionTitle = document.querySelector('section h2');
    
    // Update title
    collectionTitle.textContent = collection.toUpperCase().replace('-', ' ');
    
    // Get products for selected collection
    const products = productsData[collection] || [];
    
    // Update product grid
    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Show all products initially
    const allProducts = Object.values(productsData).flat();
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
    
    const checkboxes = document.querySelectorAll('#collection input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            // Uncheck all other checkboxes
            checkboxes.forEach(cb => {
                if (cb !== e.target) {
                    cb.checked = false;
                }
            });
            
            // Get collection name from checkbox value
            const collection = e.target.value.toLowerCase().replace(' ', '');
            
            // Update products if checkbox is checked
            if (e.target.checked) {
                updateProductDisplay(collection);
            } else {
                // If unchecked, show all products
                const allProducts = Object.values(productsData).flat();
                document.querySelector('section h2').textContent = 'ALL PRODUCTS';
                document.getElementById('product-grid').innerHTML = 
                    allProducts.map(product => createProductCard(product)).join('');
            }
        });
    });
});

// Replace the existing click event listener for add to cart buttons
document.addEventListener('click', function(e) {
    const addToCartBtn = e.target.closest('.add-to-cart-btn');
    if (!addToCartBtn) return;
    
    const productId = parseInt(addToCartBtn.dataset.productId);
    if (!productId) return;
    
    addToCart(productId);
    
    // Show button feedback
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = 'Added!';
    addToCartBtn.style.backgroundColor = '#16a34a';
    
    setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.style.backgroundColor = '';
    }, 2000);
});

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.querySelector('.search-results');
    let debounceTimer;

    // Get all products in flat array
    const allProducts = Object.values(productsData).flat();

    function debounce(func, delay) {
        return function executedFunction(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    const handleSearch = debounce((event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        if (searchTerm.length < 2) {
            searchResults.classList.remove('active');
            searchResults.classList.add('hidden');
            return;
        }

        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.collection.toLowerCase().includes(searchTerm) ||
            product.price.toString().includes(searchTerm)
        );

        if (filteredProducts.length > 0) {
            searchResults.innerHTML = filteredProducts
                .map(product => `
                    <div class="search-result-item" data-product-id="${product.id}">
                        <div class="flex items-center gap-3">
                            <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-contain">
                            <div>
                                <div class="font-medium">${highlightText(product.name, searchTerm)}</div>
                                <div class="text-sm text-gray-500">${product.price.toFixed(2)} MAD</div>
                            </div>
                        </div>
                    </div>
                `)
                .join('');

            searchResults.classList.remove('hidden');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    No products found
                </div>
            `;
            searchResults.classList.remove('hidden');
            searchResults.classList.add('active');
        }
    }, 300);

    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 2) {
            searchResults.classList.remove('hidden');
            searchResults.classList.add('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
            searchResults.classList.add('hidden');
        }
    });

    // Handle search result click
    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
            const productId = parseInt(resultItem.dataset.productId);
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                // Update product grid to show only this product
                const productGrid = document.getElementById('product-grid');
                productGrid.innerHTML = createProductCard(product);
                
                // Update title
                document.querySelector('section h2').textContent = 
                    product.collection.toUpperCase();
                
                // Clear search
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchResults.classList.add('hidden');
            }
        }
    });
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    initializeSearch();
});

// Add to all pages
document.addEventListener('DOMContentLoaded', function() {
    const supportToggle = document.getElementById('supportToggle');
    const supportWidget = document.querySelector('.support-widget');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const startLiveChat = document.getElementById('startLiveChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle support widget
    supportToggle.addEventListener('click', () => {
        supportWidget.classList.toggle('active');
        chatWindow.style.display = 'none';
    });

    // Start live chat
    startLiveChat.addEventListener('click', (e) => {
        e.preventDefault();
        chatWindow.style.display = 'flex';
        supportWidget.classList.remove('active');
    });

    // Close chat window
    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // Handle sending messages
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const messageEl = document.createElement('div');
            messageEl.style.marginBottom = '10px';
            messageEl.textContent = `You: ${message}`;
            chatMessages.appendChild(messageEl);
            chatInput.value = '';
            
            // Automated response
            setTimeout(() => {
                const responseEl = document.createElement('div');
                responseEl.style.marginBottom = '10px';
                responseEl.style.color = '#0b4eec';
                responseEl.textContent = 'Support: Thank you for your message. Our team will get back to you shortly.';
                chatMessages.appendChild(responseEl);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close support widget when clicking outside
    document.addEventListener('click', (e) => {
        if (!supportWidget.contains(e.target) && 
            !supportToggle.contains(e.target) && 
            !chatWindow.contains(e.target)) {
            supportWidget.classList.remove('active');
        }
    });
});

// --- Mobile Menu Toggle ---
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('menu-open');
        });
    }

    if (header && mobileMenu) {
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('menu-open');
            }
        });
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('menu-open');
        }
    });
});

// --- Product Loading and Filtering ---
function loadProducts(selectedCategory = '') {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productGrid = document.getElementById('product-grid');
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Filter products based on selected category
    const filteredProducts = selectedCategory ? 
        products.filter(product => 
            product.category === selectedCategory || 
            product.collection === selectedCategory
        ) : 
        products;

    // Update display
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const productCard = `
                <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                    <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" class="product-link">
                        <img src="${product.mainImage}" 
                             alt="${product.name}" 
                             class="mb-4 w-64 h-64 object-contain">
                        <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                        <p class="text-sm text-gray-400 mb-2">${product.category} - ${product.collection}</p>
                        <p class="text-gray-500 text-base mb-2">
                            ${product.discountPrice ? 
                                `<span class="line-through mr-2">${product.price} MAD</span>
                                 <span class="text-red-500">${product.discountPrice} MAD</span>` 
                                : `${product.price} MAD`}
                        </p>
                    </a>
                    <div class="mt-4 flex gap-2 w-full">
                        <button onclick="addToCart(${product.id})" 
                                class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                            Add to Cart
                        </button>
                        <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" 
                           class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-center">
                            View Details
                        </a>
                    </div>
                </div>
            `;
            productGrid.innerHTML += productCard;
        });
    } else {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                No products found in this category
            </div>
        `;
    }
}

function loadCategoriesAndCollections() {
    const categories = JSON.parse(localStorage.getItem('categories') || '{}');
    const collectionsContainer = document.getElementById('collection');
    
    // Create the HTML for categories and collections
    let html = `
        <a href="#" 
           class="py-2 hover:text-gray-700 cursor-pointer category-link active" 
           data-category="">
            All Collections
        </a>
    `;

    // Add categories and their collections
    Object.entries(categories).forEach(([category, collections]) => {
        html += `
            <div class="mb-2">
                <a href="#" 
                   class="py-2 hover:text-gray-700 cursor-pointer category-link" 
                   data-category="${category}">
                    ${category}
                </a>
                <div class="ml-4">
                    ${collections.map(collection => `
                        <a href="#" 
                           class="py-1 block hover:text-gray-700 cursor-pointer collection-link" 
                           data-category="${category}" 
                           data-collection="${collection}">
                            ${collection}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });

    collectionsContainer.innerHTML = html;

    // Add click event listeners
    document.querySelectorAll('.category-link, .collection-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.category-link, .collection-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Load filtered products
            const category = link.getAttribute('data-category');
            const collection = link.getAttribute('data-collection');
            loadProducts(category, collection);
        });
    });
}

// --- Search Functionality ---
function handleSearch(searchTerm) {
    // Get all products from localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productGrid = document.getElementById('product-grid');
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Filter products based on search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.collection?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update display
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.innerHTML += productCard;
        });
    } else {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                No products found matching "${searchTerm}"
            </div>
        `;
    }
}

// Helper function to create product card HTML
function createProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" class="product-link">
                <img src="${product.mainImage}" 
                     alt="${product.name}" 
                     class="mb-4 w-64 h-64 object-contain">
                <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                <p class="text-gray-500 text-base mb-2">
                    ${product.discountPrice ? 
                        `<span class="line-through mr-2">${product.price} MAD</span>
                         <span class="text-red-500">${product.discountPrice} MAD</span>` 
                        : `${product.price} MAD`}
                </p>
            </a>
            <div class="mt-4 flex gap-2 w-full">
                <button onclick="addToCart(${product.id})" 
                        class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Add to Cart
                </button>
                <a href="/my-watch-colne/frontend/src/views/store/product-info.html?id=${product.id}" 
                   class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-center">
                    View Details
                </a>
            </div>
        </div>
    `;
}

// --- DOMContentLoaded Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    // Save products to localStorage if not already there
    if (!localStorage.getItem('products')) {
        // You may want to load your productsData here if needed
        // localStorage.setItem('products', JSON.stringify(productsData));
    }
    
    loadCategoriesAndCollections();
    loadProducts();

    // Search input event
    const searchInput = document.getElementById('search-input');
    let debounceTimer;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.trim();
            if (searchTerm === '') {
                loadProducts(); // Show all products if search is empty
            } else {
                handleSearch(searchTerm);
            }
        }, 300);
    });
});
