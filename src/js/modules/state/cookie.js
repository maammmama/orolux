document.addEventListener('DOMContentLoaded', function() {
      // Cookie preference management
      const analyticsCookies = document.getElementById('analyticsCookies');
      const marketingCookies = document.getElementById('marketingCookies');
      const saveBtn = document.getElementById('savePreferences');
      const acceptAllBtn = document.getElementById('acceptAll');
      
      // Load saved preferences
      if (localStorage.getItem('cookiePrefs')) {
        const prefs = JSON.parse(localStorage.getItem('cookiePrefs'));
        analyticsCookies.checked = prefs.analytics;
        marketingCookies.checked = prefs.marketing;
      }
      
      // Save preferences
      saveBtn.addEventListener('click', function() {
        const prefs = {
          analytics: analyticsCookies.checked,
          marketing: marketingCookies.checked
        };
        localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
        alert('Your cookie preferences have been saved.');
      });
      
      // Accept all
      acceptAllBtn.addEventListener('click', function() {
        analyticsCookies.checked = true;
        marketingCookies.checked = true;
        const prefs = {
          analytics: true,
          marketing: true
        };
        localStorage.setItem('cookiePrefs', JSON.stringify(prefs));
        alert('All cookies have been accepted.');
      });
      
      // Cart count would be dynamic in a real implementation
      function updateCartCount(count) {
        const cartElement = document.querySelector('.nav-item[href*="cart"]');
        if (cartElement) {
          cartElement.textContent = `Cart (${count})`;
        }
      }
      updateCartCount(0);
    });

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

// Cookie management functionality
class CookieManager {
    constructor() {
        this.consentKey = 'cookieConsent';
        this.preferencesKey = 'cookiePreferences';
        this.initializeBanner();
        this.loadPreferences();
    }

    initializeBanner() {
        if (!this.hasConsent()) {
            this.showBanner();
        }
    }

    hasConsent() {
        return localStorage.getItem(this.consentKey) === 'true';
    }

    showBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <h3>We Value Your Privacy</h3>
                <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                   By clicking "Accept All", you consent to our use of cookies.</p>
                <div class="cookie-buttons">
                    <a href="/my-watch-colne/frontend/src/views/store/cookie-policy.html" class="btn-manage">Manage Settings</a>
                    <button class="btn-accept">Accept All</button>
                </div>
                <a href="/privacy-policy" class="privacy-link">Privacy Policy</a>
            </div>
        `;

        document.body.appendChild(banner);
        
        // Add event listeners
        banner.querySelector('.btn-accept').addEventListener('click', () => {
            this.acceptAll();
            this.hideBanner();
        });
    }

    hideBanner() {
        const banner = document.querySelector('.cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
    }

    acceptAll() {
        const preferences = {
            essential: true,
            analytics: true,
            marketing: true
        };
        
        localStorage.setItem(this.consentKey, 'true');
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
    }

    loadPreferences() {
        const preferences = localStorage.getItem(this.preferencesKey);
        return preferences ? JSON.parse(preferences) : null;
    }

    savePreferences(preferences) {
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
        localStorage.setItem(this.consentKey, 'true');
    }
}

// Initialize cookie manager
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});