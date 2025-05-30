document.addEventListener('DOMContentLoaded', function() {
    // Category and Collection Management
    const categoryForm = document.getElementById('category-form');
    const collectionForm = document.getElementById('collection-form');
    const categorySelect = document.getElementById('category-select');
    const categoriesList = document.getElementById('categories-list');

    function loadCategories() {
        const categories = JSON.parse(localStorage.getItem('categories') || '{}');
        
        // Update category select
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            ${Object.keys(categories).map(category => `
                <option value="${category}">${category}</option>
            `).join('')}
        `;

        // Update categories list
        categoriesList.innerHTML = Object.entries(categories).map(([category, collections]) => `
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-medium">${category}</h4>
                    <button 
                        onclick="deleteCategory('${category}')" 
                        class="text-red-600 hover:text-red-800"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="pl-4 space-y-2">
                    ${collections.map(collection => `
                        <div class="flex justify-between items-center">
                            <span>${collection}</span>
                            <button 
                                onclick="deleteCollection('${category}', '${collection}')"
                                class="text-red-600 hover:text-red-800"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newCategory = document.getElementById('new-category').value.trim();
        
        if (newCategory) {
            const categories = JSON.parse(localStorage.getItem('categories') || '{}');
            if (!categories[newCategory]) {
                categories[newCategory] = [];
                localStorage.setItem('categories', JSON.stringify(categories));
                loadCategories();
                document.getElementById('new-category').value = '';
            }
        }
    });

    collectionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const category = categorySelect.value;
        const newCollection = document.getElementById('new-collection').value.trim();
        
        if (category && newCollection) {
            const categories = JSON.parse(localStorage.getItem('categories') || '{}');
            if (categories[category] && !categories[category].includes(newCollection)) {
                categories[category].push(newCollection);
                localStorage.setItem('categories', JSON.stringify(categories));
                loadCategories();
                document.getElementById('new-collection').value = '';
            }
        }
    });

    window.deleteCategory = function(category) {
        if (confirm('Are you sure you want to delete this category and all its collections?')) {
            const categories = JSON.parse(localStorage.getItem('categories') || '{}');
            delete categories[category];
            localStorage.setItem('categories', JSON.stringify(categories));
            loadCategories();
        }
    }

    window.deleteCollection = function(category, collection) {
        if (confirm('Are you sure you want to delete this collection?')) {
            const categories = JSON.parse(localStorage.getItem('categories') || '{}');
            categories[category] = categories[category].filter(c => c !== collection);
            localStorage.setItem('categories', JSON.stringify(categories));
            loadCategories();
        }
    }

    // Get the category and collection selects
    const productCategorySelect = document.getElementById('product-category');
    const productCollectionSelect = document.getElementById('product-collection');

    function updateProductCategorySelects() {
        const categories = JSON.parse(localStorage.getItem('categories') || '{}');
        
        // Update product category select
        productCategorySelect.innerHTML = `
            <option value="">Select a category</option>
            ${Object.keys(categories).map(category => `
                <option value="${category}">${category}</option>
            `).join('')}
        `;
    }

    // Update collections when category is selected
    productCategorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        const categories = JSON.parse(localStorage.getItem('categories') || '{}');
        productCollectionSelect.innerHTML = `
            <option value="">Select a collection</option>
            ${selectedCategory && categories[selectedCategory] ? 
                categories[selectedCategory].map(collection => `
                    <option value="${collection}">${collection}</option>
                `).join('') 
                : ''
            }
        `;
    });

    // Add to your existing form submission handler
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productData = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            sku: document.getElementById('sku').value,
            category: document.getElementById('product-category').value,
            collection: document.getElementById('product-collection').value,
            brand: document.getElementById('brand').value,
            price: document.getElementById('price').value,
            discountPrice: document.getElementById('discount-price').value,
            quantity: document.getElementById('quantity').value,
            status: document.getElementById('status').checked,
            
            // Details and Technical Data
            details: document.getElementById('short-description').value,
            technicalData: document.getElementById('full-description').innerHTML,
            
            // Specifications
            specifications: {
                movement: document.getElementById('movement').value,
                caseMaterial: document.getElementById('case-material').value,
                dialColor: document.getElementById('dial-color').value,
                waterResistance: document.getElementById('water-resistance').value
            },
            
            // Images
            mainImage: document.getElementById('main-image').files[0] ? 
                URL.createObjectURL(document.getElementById('main-image').files[0]) : 
                '/my-watch-colne/frontend/src/images/products/arrival-1.png',
            galleryImages: Array.from(document.getElementById('gallery-images').files)
                .map(file => URL.createObjectURL(file))
        };

        // Save product data
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        // Show success message
        alert('Product saved successfully!');
        
        // Reset form
        this.reset();
    });

    // Call this function after adding new categories/collections
    function refreshSelects() {
        updateProductCategorySelects();
        // Reset collection select
        productCollectionSelect.innerHTML = '<option value="">Select a collection</option>';
    }

    // Initial load
    loadCategories();
    updateProductCategorySelects();

    const productForm = document.querySelector('form');
    
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get rich text editor content
        const technicalData = document.getElementById('full-description').innerHTML;
        const details = document.getElementById('short-description').value;
        
        // Create product object
        const productData = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            sku: document.getElementById('sku').value,
            category: document.getElementById('category').value,
            brand: document.getElementById('brand').value,
            price: document.getElementById('price').value,
            discountPrice: document.getElementById('discount-price').value,
            quantity: document.getElementById('quantity').value,
            status: document.getElementById('status').checked,
            
            // Details and Technical Data
            details: details,
            technicalData: technicalData,
            
            // Specifications
            specifications: {
                movement: document.getElementById('movement').value,
                caseMaterial: document.getElementById('case-material').value,
                dialColor: document.getElementById('dial-color').value,
                waterResistance: document.getElementById('water-resistance').value
            },
            
            // Images
            mainImage: document.getElementById('main-image').files[0] ? 
                URL.createObjectURL(document.getElementById('main-image').files[0]) : 
                '/my-watch-colne/frontend/src/images/products/arrival-1.png',
            galleryImages: Array.from(document.getElementById('gallery-images').files)
                .map(file => URL.createObjectURL(file))
        };

        // Save to localStorage
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        // Show success message
        alert('Product saved successfully!');
        
        // Reset form
        productForm.reset();
        document.getElementById('full-description').innerHTML = '';
    });

    document.querySelector('form.divide-y').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedCategory = document.getElementById('product-category').value;
        const selectedCollection = document.getElementById('product-collection').value;
        
        if (!selectedCategory || !selectedCollection) {
            alert('Please select both category and collection');
            return;
        }
        
        const productData = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            sku: document.getElementById('sku').value,
            category: selectedCategory,
            collection: selectedCollection,
            brand: document.getElementById('brand').value,
            price: document.getElementById('price').value,
            discountPrice: document.getElementById('discount-price').value || null,
            quantity: document.getElementById('quantity').value,
            status: document.getElementById('status').checked,
            visibility: document.getElementById('visibility').checked,
            
            details: document.getElementById('short-description').value,
            technicalData: document.getElementById('full-description').innerHTML,
            
            specifications: {
                movement: document.getElementById('movement').value,
                caseMaterial: document.getElementById('case-material').value,
                dialColor: document.getElementById('dial-color').value,
                waterResistance: document.getElementById('water-resistance').value
            },
            
            mainImage: document.getElementById('main-image').files[0] ? 
                URL.createObjectURL(document.getElementById('main-image').files[0]) : 
                '/my-watch-colne/frontend/src/images/products/arrival-1.png',
            galleryImages: Array.from(document.getElementById('gallery-images').files)
                .map(file => URL.createObjectURL(file))
        };

        // Get existing products
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Add new product
        products.push(productData);
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Update categories with the new product
        const categories = JSON.parse(localStorage.getItem('categories') || '{}');
        if (!categories[selectedCategory]) {
            categories[selectedCategory] = [];
        }
        if (!categories[selectedCategory].includes(selectedCollection)) {
            categories[selectedCategory].push(selectedCollection);
        }
        localStorage.setItem('categories', JSON.stringify(categories));

        // Show success message
        alert('Product saved successfully!');
        
        // Reset form
        this.reset();
        document.getElementById('main-image-preview').classList.add('hidden');
        document.getElementById('gallery-preview').classList.add('hidden');
        document.getElementById('full-description').innerHTML = '';
        
        // Refresh category selects
        updateProductCategorySelects();
    });
});

// Handle image preview for main product image
document.getElementById('main-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('main-image-preview');
            const img = preview.querySelector('img');
            img.src = event.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Handle image preview for gallery images
document.getElementById('gallery-images').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const previewContainer = document.getElementById('gallery-preview');
        previewContainer.innerHTML = '<p class="text-sm text-gray-500 mb-2">Preview:</p><div class="flex flex-wrap gap-2" id="gallery-images-container"></div>';
        
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const container = document.getElementById('gallery-images-container');
                const img = document.createElement('img');
                img.src = event.target.result;
                img.className = 'image-preview h-24 w-24 object-cover rounded-md border';
                container.appendChild(img);
            };
            reader.readAsDataURL(files[i]);
        }
        
        previewContainer.classList.remove('hidden');
    }
});

// Simple rich text editor functionality
document.querySelectorAll('.rich-text-toolbar button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const command = this.getAttribute('title').toLowerCase();
        document.execCommand(command, false, null);
    });
});