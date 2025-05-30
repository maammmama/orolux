// Remove the sample users array and always load from localStorage
let users = JSON.parse(localStorage.getItem('users') || '[]');

// Add sample users if none exist
if (users.length === 0) {
    users = [
        {
            fullName: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1234567890',
            status: 'active',
            registrationDate: new Date('2025-01-15').toISOString(),
            orders: [1, 2, 3, 4, 5, 6]
        },
        {
            fullName: 'Jane Doe',
            email: 'jane.doe@example.com',
            phone: '+1987654321',
            status: 'blocked',
            registrationDate: new Date('2025-03-20').toISOString(),
            orders: [1, 2, 3]
        },
        {
            fullName: 'Mike Johnson',
            email: 'mike.j@example.com',
            phone: '+1122334455',
            status: 'inactive',
            registrationDate: new Date('2025-05-01').toISOString(),
            orders: [1, 2]
        },
        {
            fullName: 'Sarah Williams',
            email: 'sarah.w@example.com',
            phone: '+1555666777',
            status: 'active',
            registrationDate: new Date('2025-04-15').toISOString(),
            orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

// DOM elements
const usersTableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const orderFilter = document.getElementById('orderFilter');
const dateFilter = document.getElementById('dateFilter');

// Modal elements
const userDetailsModal = document.getElementById('userDetailsModal');
const userFormModal = document.getElementById('userFormModal');
const confirmModal = document.getElementById('confirmModal');

// Buttons
const addUserBtn = document.getElementById('addUserBtn');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const closeFormModal = document.getElementById('closeFormModal');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const confirmActionBtn = document.getElementById('confirmActionBtn');

// Form elements
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const statusInput = document.getElementById('status');
const formModalTitle = document.getElementById('formModalTitle');

// Initialize the dashboard
function initDashboard() {
    renderUsersTable();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Add user button
    addUserBtn.addEventListener('click', () => showUserForm());

    // Modal close buttons
    closeDetailsModal.addEventListener('click', () => userDetailsModal.style.display = 'none');
    closeDetailsBtn.addEventListener('click', () => userDetailsModal.style.display = 'none');
    closeFormModal.addEventListener('click', () => userFormModal.style.display = 'none');
    cancelFormBtn.addEventListener('click', () => userFormModal.style.display = 'none');
    closeConfirmModal.addEventListener('click', () => confirmModal.style.display = 'none');
    cancelConfirmBtn.addEventListener('click', () => confirmModal.style.display = 'none');

    // Save user button
    saveUserBtn.addEventListener('click', saveUser);

    // Search and filter inputs
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    orderFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === userDetailsModal) userDetailsModal.style.display = 'none';
        if (e.target === userFormModal) userFormModal.style.display = 'none';
        if (e.target === confirmModal) confirmModal.style.display = 'none';
    });

    // Event delegation for action buttons
    usersTableBody.addEventListener('click', handleTableAction);
}

// Handle table action buttons
function handleTableAction(e) {
    const button = e.target.closest('button');
    if (!button) return;

    const idx = button.getAttribute('data-idx');
    if (!idx) return;

    if (button.classList.contains('view-btn')) {
        showUserDetails(users[idx]);
    } else if (button.classList.contains('edit-btn')) {
        showUserForm(users[idx]);
    } else if (button.classList.contains('delete-btn')) {
        showDeleteConfirmation(idx);
    }
}

// Render users table with filtering
function renderUsersTable() {
    let filteredUsers = filterUsers();
    
    if (filteredUsers.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    No users found. ${users.length === 0 ? 'Click the "Add User" button to create one.' : 'Try adjusting your filters.'}
                </td>
            </tr>
        `;
        return;
    }

    usersTableBody.innerHTML = filteredUsers.map((user, idx) => `
        <tr>
            <td>${user.fullName || ''}</td>
            <td>${user.email || ''}</td>
            <td>${user.phone || ''}</td>
            <td>${formatDate(user.registrationDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-idx="${idx}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-idx="${idx}" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-idx="${idx}" title="Delete User">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter users based on search and filter criteria
function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const orderCount = orderFilter.value;
    const dateRange = dateFilter.value;

    return users.filter(user => {
        // Search filter
        const matchesSearch = !searchTerm || 
            user.fullName?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm) ||
            user.phone?.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !status || user.status === status;

        // Order count filter (assuming user.orders is an array)
        const matchesOrders = !orderCount || 
            (user.orders?.length >= parseInt(orderCount)) || 
            false;

        // Date filter
        const registrationDate = new Date(user.registrationDate);
        const now = new Date();
        let matchesDate = true;

        if (dateRange === 'today') {
            matchesDate = registrationDate.toDateString() === now.toDateString();
        } else if (dateRange === 'week') {
            const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            matchesDate = registrationDate >= weekAgo;
        } else if (dateRange === 'month') {
            matchesDate = registrationDate.getMonth() === now.getMonth() &&
                         registrationDate.getFullYear() === now.getFullYear();
        } else if (dateRange === 'year') {
            matchesDate = registrationDate.getFullYear() === now.getFullYear();
        }

        return matchesSearch && matchesStatus && matchesOrders && matchesDate;
    });
}

// Apply filters and re-render table
function applyFilters() {
    renderUsersTable();
}

// Show user details in modal
function showUserDetails(user) {
    const content = document.getElementById('userDetailsContent');
    content.innerHTML = `
        <div class="user-details">
            <p><strong>Full Name:</strong> ${user.fullName || ''}</p>
            <p><strong>Email:</strong> ${user.email || ''}</p>
            <p><strong>Phone:</strong> ${user.phone || ''}</p>
            <p><strong>Status:</strong> <span class="status-badge ${user.status || 'active'}">${user.status || 'Active'}</span></p>
            <p><strong>Registration Date:</strong> ${formatDate(user.registrationDate)}</p>
            <p><strong>Orders:</strong> ${user.orders?.length || 0}</p>
        </div>
    `;
    userDetailsModal.style.display = 'block';
}

// Show add/edit user form
function showUserForm(user = null) {
    formModalTitle.textContent = user ? 'Edit User' : 'Add New User';
    userIdInput.value = user ? users.indexOf(user) : '';
    fullNameInput.value = user ? user.fullName : '';
    emailInput.value = user ? user.email : '';
    phoneInput.value = user ? user.phone : '';
    statusInput.value = user ? user.status : 'active';
    userFormModal.style.display = 'block';
}

// Save user (create or update)
function saveUser() {
    const user = {
        fullName: fullNameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        status: statusInput.value,
        registrationDate: new Date().toISOString()
    };

    const idx = userIdInput.value;
    if (idx === '') {
        // New user
        users.push(user);
    } else {
        // Update existing user
        user.registrationDate = users[idx].registrationDate; // Preserve original registration date
        users[idx] = user;
    }

    localStorage.setItem('users', JSON.stringify(users));
    userFormModal.style.display = 'none';
    renderUsersTable();
}

// Show delete confirmation modal
function showDeleteConfirmation(idx) {
    const user = users[idx];
    document.getElementById('confirmModalMessage').textContent = `Are you sure you want to delete user "${user.fullName}"? This action cannot be undone.`;
    confirmActionBtn.onclick = () => {
        deleteUser(idx);
        confirmModal.style.display = 'none';
    };
    confirmModal.style.display = 'block';
}

// Delete user
function deleteUser(idx) {
    users.splice(idx, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsersTable();
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);