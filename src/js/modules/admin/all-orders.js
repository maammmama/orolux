// Simple JavaScript for functionality
document.addEventListener('DOMContentLoaded', function() {
    // Function to load and display orders
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const tbody = document.querySelector('#ordersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = orders.map((order, index) => `
            <tr data-order-id="${index}" class="hover:bg-gray-50">
                <td class="px-6 py-3"><input type="checkbox" class="order-checkbox"></td>
                <td class="px-6 py-3">${order.productName || 'N/A'}</td>
                <td class="px-6 py-3">${new Date(order.orderDate).toLocaleString()}</td>
                <td class="px-6 py-3">${order.firstName || ''}</td>
                <td class="px-6 py-3">${order.lastName || ''}</td>
                <td class="px-6 py-3">${order.address || ''}</td>
                <td class="px-6 py-3">${order.city || ''}</td>
                <td class="px-6 py-3">${order.phone || ''}</td>
                <td class="px-6 py-3">${order.email || ''}</td>
                <td class="px-6 py-3">${order.quantity || ''}</td>
                <td class="px-6 py-3">${order.total ? order.total.toFixed(2) + ' MAD' : 'N/A'}</td>
                <td class="px-6 py-3">${order.message || ''}</td>
                <td class="px-6 py-3">
                    <div class="flex items-center space-x-2">
                        <button onclick="editOrder(${index})" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteOrder(${index})" class="text-red-600 hover:text-red-800 ml-2">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Make editOrder and closeDrawer globally accessible
    window.editOrder = function(orderIndex) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders[orderIndex];
        
        const drawer = document.getElementById('order-details-drawer');
        if (!drawer) return;
        
        const drawerContent = drawer.querySelector('.drawer-body');
        
        drawerContent.innerHTML = `
            <form id="edit-order-form" class="space-y-6">
                <input type="hidden" name="orderIndex" value="${orderIndex}">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" value="${order.firstName || ''}" 
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" value="${order.lastName || ''}"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" name="address" value="${order.address || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">City</label>
                    <input type="text" name="city" value="${order.city || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" name="phone" value="${order.phone || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value="${order.email || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" name="quantity" value="${order.quantity || ''}"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeDrawer()" 
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        Cancel
                    </button>
                    <button type="submit" 
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        `;

        // Show drawer
        drawer.style.display = 'block';
        drawer.classList.add('open');

        // Handle form submission
        const form = document.getElementById('edit-order-form');
        form.addEventListener('submit', saveOrderChanges);
    };

    window.closeDrawer = function() {
        const drawer = document.getElementById('order-details-drawer');
        if (drawer) {
            drawer.classList.remove('open');
            setTimeout(() => {
                drawer.style.display = 'none';
            }, 300); // Match transition duration
        }
    };

    function saveOrderChanges(e) {
        e.preventDefault();
        
        const form = e.target;
        const orderIndex = form.querySelector('[name="orderIndex"]').value;
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Update order data
        orders[orderIndex] = {
            ...orders[orderIndex],
            firstName: form.querySelector('[name="firstName"]').value,
            lastName: form.querySelector('[name="lastName"]').value,
            address: form.querySelector('[name="address"]').value,
            city: form.querySelector('[name="city"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            quantity: form.querySelector('[name="quantity"]').value
        };

        // Save to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));

        // Close drawer
        closeDrawer();

        // Reload orders table
        loadOrders();

        // Show success message
        showNotification('Order updated successfully');
    }

    // Add delete function
    window.deleteOrder = function(orderIndex) {
        if (confirm('Are you sure you want to delete this order?')) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.splice(orderIndex, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Show success notification
            showNotification('Order deleted successfully');
            
            // Reload orders table
            loadOrders();
            
            // Update order count
            updateOrderCount();
        }
    };

    // Add notification function if not already present
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg';
        notification.style.zIndex = '9999';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Handle select all checkbox
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#ordersTable tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // Handle refresh button
    const refreshButton = document.querySelector('.fa-sync-alt').parentElement;
    if (refreshButton) {
        refreshButton.addEventListener('click', loadOrders);
    }

    // Handle search functionality
    const searchInput = document.getElementById('search-orders');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#ordersTable tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Initial load of orders
    loadOrders();
});