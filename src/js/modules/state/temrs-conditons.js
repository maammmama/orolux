 document.addEventListener('DOMContentLoaded', function() {
      // Cart count would be dynamic in a real implementation
      function updateCartCount(count) {
        const cartElement = document.querySelector('.nav-item[href*="cart"]');
        if (cartElement) {
          cartElement.textContent = `Cart (${count})`;
        }
      }
      updateCartCount(0);
    });

    // Chat Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatTrigger = document.getElementById('chatTrigger');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chat window
    chatTrigger.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        chatTrigger.style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatTrigger.style.display = 'flex';
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
        chatWindow.style.display = 'none'; // Hide chat window when showing support
    });

    // Start live chat
    startLiveChat.addEventListener('click', (e) => {
        e.preventDefault();
        chatWindow.style.display = 'flex';
        supportWidget.classList.remove('active'); // Hide support widget when starting chat
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

// Responsive header menu toggle
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