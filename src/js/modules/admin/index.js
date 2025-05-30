try {
            // Toggle sidebar
            function toggleSidebar() {
                const sidebar = document.getElementById('sidebar');
                const contentArea = document.getElementById('content-area');
                const header = document.querySelector('header');
                
                sidebar.classList.toggle('w-64');
                sidebar.classList.toggle('w-20');
                
                contentArea.classList.toggle('ml-64');
                contentArea.classList.toggle('ml-20');
                
                header.classList.toggle('left-64');
                header.classList.toggle('left-20');
                
                // Toggle text visibility
                const texts = sidebar.querySelectorAll('.sidebar-text, .logo-text');
                texts.forEach(text => text.classList.toggle('hidden'));
            }
            
            // Toggle dropdowns
            window.toggleDropdown = function(id) {
                const dropdowns = document.querySelectorAll('.dropdown-content');
                dropdowns.forEach(dropdown => {
                    if(dropdown.id !== id && dropdown.classList.contains('show-dropdown')) {
                        dropdown.classList.remove('show-dropdown');
                        const chevron = dropdown.previousElementSibling.querySelector('.fa-chevron-down');
                        if(chevron) chevron.classList.remove('rotate-180');
                    }
                });

                const dropdown = document.getElementById(id);
                if (!dropdown) return; // Guard clause
                const chevron = dropdown.previousElementSibling.querySelector('.fa-chevron-down');
                
                dropdown.classList.toggle('show-dropdown');
                if(chevron) chevron.classList.toggle('rotate-180');
            }
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.matches('.dropdown *')) {
                    const dropdowns = document.querySelectorAll('.dropdown-content');
                    dropdowns.forEach(dropdown => {
                        if (dropdown.classList.contains('show-dropdown')) {
                            dropdown.classList.remove('show-dropdown');
                            // Reset chevron rotation
                            const chevron = dropdown.previousElementSibling.querySelector('.fa-chevron-down');
                            if (chevron) chevron.classList.remove('rotate-180');
                        }
                    });
                }
            });
            
            // Initialize charts
            document.addEventListener('DOMContentLoaded', function() {
                // Sales Chart
                const salesCtx = document.getElementById('salesChart');
                if (salesCtx) {
                    new Chart(salesCtx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                            datasets: [{
                                label: 'Sales',
                                data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
                                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 2,
                                tension: 0.1,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        drawBorder: false
                                    }
                                },
                                x: {
                                    grid: {
                                        display: false
                                    }
                                }
                            }
                        }
                    });
                }
                
                // Traffic Chart
                const trafficCtx = document.getElementById('trafficChart');
                if (trafficCtx) {
                    new Chart(trafficCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Direct', 'Organic', 'Referral', 'Social'],
                            datasets: [{
                                data: [35, 30, 20, 15],
                                backgroundColor: [
                                    'rgba(59, 130, 246, 1)',
                                    'rgba(16, 185, 129, 1)',
                                    'rgba(245, 158, 11, 1)',
                                    'rgba(139, 92, 246, 1)'
                                ],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    align: 'center'
                                }
                            },
                            cutout: '70%'
                        }
                    });
                }
            });
            
            window.addEventListener('resize', function() {
                const width = window.innerWidth;
                const sidebar = document.getElementById('sidebar');
                if (width < 768 && !sidebar.classList.contains('w-20')) {
                    toggleSidebar();
                }
            });
            
            // Update order count function
function updateOrderCount() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalOrdersElement = document.getElementById('totalOrdersCount');
    if (totalOrdersElement) {
        totalOrdersElement.textContent = orders.length;
    }
}

// Function to delete an order
function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        updateRecentOrders();
        updateOrderCount();
    }
}

// Function to edit an order
function editOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
    modal.id = 'editModal';
    
    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Order</h3>
                <form id="editOrderForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
                        <select name="status" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                            <input type="text" name="firstName" value="${order.firstName || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                            <input type="text" name="lastName" value="${order.lastName || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <input type="text" name="address" value="${order.address || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">City</label>
                        <input type="text" name="city" value="${order.city || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                        <input type="tel" name="phone" value="${order.phone || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value="${order.email || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                            <input type="number" name="quantity" value="${order.quantity || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Size</label>
                            <input type="text" name="size" value="${order.size || ''}" class="shadow border rounded w-full py-2 px-3 text-gray-700">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Message</label>
                        <textarea name="message" class="shadow border rounded w-full py-2 px-3 text-gray-700">${order.message || ''}</textarea>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="closeEditModal()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = document.getElementById('editOrderForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const updatedOrder = {
            ...order,
            ...Object.fromEntries(formData),
            updatedAt: new Date().toISOString()
        };
        
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex] = updatedOrder;
            localStorage.setItem('orders', JSON.stringify(orders));
            updateRecentOrders();
        }
        
        closeEditModal();
    });
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// Function to update the recent orders display
function updateRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    const recent = orders.slice(0, 5);

    const tbody = document.getElementById('recent-orders-table');
    if (!tbody) return;

    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" class="py-4 text-center text-gray-400">No orders found.</td></tr>`;
        return;
    }

    tbody.innerHTML = recent.map(order => `
        <tr>
            <td class="py-2 px-4">${order.productName || ''}</td>
            <td class="py-2 px-4">${order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}</td>
            <td class="py-2 px-4">${order.firstName || ''}</td>
            <td class="py-2 px-4">${order.lastName || ''}</td>
            <td class="py-2 px-4">${order.address || ''}</td>
            <td class="py-2 px-4">${order.city || ''}</td>
            <td class="py-2 px-4">${order.phone || ''}</td>
            <td class="py-2 px-4">${order.email || ''}</td>
            <td class="py-2 px-4">${order.quantity || ''}</td>
            <td class="py-2 px-4">${order.size || ''}</td>
            <td class="py-2 px-4">${order.message || ''}</td>
            <td class="py-2 px-4">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}">${order.status || 'Pending'}</span>
            </td>
            <td class="py-2 px-4">
                <div class="flex space-x-2">
                    <button class="text-blue-500 hover:text-blue-700" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteOrder('${order.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update on page load
document.addEventListener('DOMContentLoaded', () => {
    updateOrderCount();
    updateRecentOrders();
});

// Update when orders change in any tab
window.addEventListener('storage', function(e) {
    if (e.key === 'orders') {
        updateOrderCount();
        updateRecentOrders();
    }
});
        } catch (error) {
            console.error('Error:', error);
        }