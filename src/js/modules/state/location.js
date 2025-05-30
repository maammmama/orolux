// Basic functionality for the buttons
document.addEventListener('DOMContentLoaded', function() {
  const locationButton = document.querySelector('.location-button');
  const loadMapButton = document.querySelector('.map-button');
  
  locationButton.addEventListener('click', function() {
    alert('Attempting to get your location...');
    // In a real implementation, this would use the Geolocation API
  });
  
  loadMapButton.addEventListener('click', function() {
    alert('Loading map...');
    // In a real implementation, this would load the Google Maps API
  });
  
  // Add mobile menu toggle functionality
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          mobileMenu.classList.toggle('show');
          const menuIcon = menuBtn.querySelector('i');
          menuIcon.classList.toggle('fa-bars');
          menuIcon.classList.toggle('fa-times');
      });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          mobileMenu.classList.remove('show');
          const menuIcon = menuBtn.querySelector('i');
          menuIcon.classList.remove('fa-times');
          menuIcon.classList.add('fa-bars');
      }
  });
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

document.addEventListener('DOMContentLoaded', function() {
  const loadMapButton = document.querySelector('.map-button');
  const mapContainer = document.getElementById('map');

  if (loadMapButton && mapContainer) {
    loadMapButton.addEventListener('click', function() {
      // Get the embed URL from localStorage
      const info = JSON.parse(localStorage.getItem('contactInfo') || '{}');
      const embedUrl = info.mapEmbed || '';

      if (embedUrl) {
        mapContainer.innerHTML = `
          <iframe 
            src="${embedUrl}" 
            width="100%" 
            height="400" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        `;
      } else {
        mapContainer.innerHTML = '<p style="color:red;">No valid map embed URL set by admin.</p>';
      }
    });
  }
});