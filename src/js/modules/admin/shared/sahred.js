import AdminSidebar from './AdminSidebar.js';

class Dashboard {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.mainContent = document.querySelector('.main-content');
        this.toggleBtn = document.querySelector('.sidebar-toggle');
        this.menuItems = document.querySelectorAll('.menu-item');
        
        this.initializeEvents();
        this.initializeCurrentPage();
    }

    initializeEvents() {
        // Sidebar toggle
        this.toggleBtn?.addEventListener('click', () => this.toggleSidebar());

        // Menu items active state
        this.menuItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleMenuClick(e));
        });

        // Handle responsive sidebar
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('sidebar-collapsed');
        this.mainContent.classList.toggle('content-expanded');
    }

    handleMenuClick(e) {
        this.menuItems.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
    }

    handleResize() {
        if (window.innerWidth < 768 && !this.sidebar.classList.contains('sidebar-collapsed')) {
            this.toggleSidebar();
        }
    }

    initializeCurrentPage() {
        const currentPath = window.location.pathname;
        this.menuItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }

    // Utility methods for notifications
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Utility method for modal handling
    handleModal(modalId, action = 'show') {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (action === 'show') {
            modal.classList.add('modal-active');
        } else {
            modal.classList.remove('modal-active');
        }
    }

    // Update the renderSidebar method to include the security section
    renderSidebar() {
        // ... existing sidebar code ...
        
        // Add this to your menu items
        `<li>
            <div class="dropdown">
                <button onclick="toggleDropdown('security-dropdown')" class="menu-item flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700">
                    <div class="flex items-center">
                        <i class="fas fa-shield-alt w-6 text-center"></i>
                        <span class="sidebar-text ml-3">Security</span>
                    </div>
                    <i class="fas fa-chevron-down text-xs transition-transform duration-200"></i>
                </button>
                <ul id="security-dropdown" class="dropdown-content pl-4 mt-1 space-y-1">
                    <li>
                        <a href="/admin/2fa-settings" class="menu-item flex items-center p-2 rounded-lg hover:bg-gray-700" data-page="2fa-settings">
                            <i class="fas fa-key w-5 text-center text-xs"></i>
                            <span class="sidebar-text ml-3">2FA Settings</span>
                        </a>
                    </li>
                    <!-- Add more security related items here -->
                </ul>
            </div>
        </li>`
        // ... rest of the sidebar code ...
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    new AdminSidebar();
});