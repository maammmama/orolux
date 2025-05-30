// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown function
    window.toggleDropdown = function(id) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (dropdown.id !== id && dropdown.classList.contains('show-dropdown')) {
                dropdown.classList.remove('show-dropdown');
                const chevron = dropdown.previousElementSibling?.querySelector('.fa-chevron-down, .fa-chevron-down.sidebar-text');
                if (chevron) chevron.classList.remove('rotate-180');
            }
        });
        const dropdown = document.getElementById(id);
        if (!dropdown) return;
        const chevron = dropdown.previousElementSibling?.querySelector('.fa-chevron-down, .fa-chevron-down.sidebar-text');
        dropdown.classList.toggle('show-dropdown');
        if (chevron) chevron.classList.toggle('rotate-180');
    };

    // Toggle sidebar function
    window.toggleSidebar = function() {
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
        const texts = sidebar.querySelectorAll('.sidebar-text');
        texts.forEach(text => text.classList.toggle('hidden'));
    };

    // Handle notifications
    function handleNotifications() {
        const showNotification = (message, type = 'success') => {
            const notification = document.createElement('div');
            notification.className = `fixed bottom-4 right-4 bg-${type === 'success' ? 'green' : 'red'}-500 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-all duration-300`;
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle mr-2"></i>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        };

        // Update notification badge
        const updateNotificationBadge = (count) => {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        };

        // Expose function globally
        window.showNotification = showNotification;
        window.updateNotificationBadge = updateNotificationBadge;
    }

    // Handle profile actions
    function handleProfileActions() {
        // Logout functionality
        const logoutBtn = document.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('adminPassword'); // Clear admin credentials
                window.location.href = '/my-watch-colne/frontend/src/views/admin/login.html';
            });
        }

        // Edit Profile functionality
        const editProfileBtn = document.querySelector('[data-action="edit-profile"]');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/my-watch-colne/frontend/src/views/admin/edit-profile.html';
            });
        }
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content.show-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show-dropdown');
                const chevron = dropdown.previousElementSibling?.querySelector('.fa-chevron-down, .fa-chevron-down.sidebar-text');
                if (chevron) chevron.classList.remove('rotate-180');
            });
        }
    });

    // Initialize all functionality
    handleNotifications();
    handleProfileActions();
});
