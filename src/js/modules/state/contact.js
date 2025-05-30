// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for your message. We will get back to you soon.');
  this.reset();
});

// Cart count would be dynamic in a real implementation
function updateCartCount(count) {
  const cartElement = document.querySelector('.nav-item[href*="cart"]');
  if (cartElement) {
    cartElement.textContent = `Cart (${count})`;
  }
}
updateCartCount(0);

// Add to your main.js file
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.querySelector('.search-close');

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Search Toggle
    searchToggle.addEventListener('click', () => {
        searchOverlay.style.display = 'block';
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.style.display = 'none';
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mobileMenu.style.display = 'none';
        }
        
        if (!searchOverlay.contains(e.target) && !searchToggle.contains(e.target)) {
            searchOverlay.style.display = 'none';
        }
    });
});