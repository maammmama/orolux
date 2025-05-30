document.addEventListener('DOMContentLoaded', function() {
    // Load existing values
    const info = JSON.parse(localStorage.getItem('contactInfo') || '{}');
    
    // Populate form fields with existing values
    if (info.facebook) document.getElementById('facebook').value = info.facebook;
    if (info.twitter) document.getElementById('twitter').value = info.twitter;
    if (info.instagram) document.getElementById('instagram').value = info.instagram;

    // Handle form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get current values from localStorage
        const currentInfo = JSON.parse(localStorage.getItem('contactInfo') || '{}');
        
        // Update with new values
        const updatedInfo = {
            ...currentInfo,
            facebook: document.getElementById('facebook').value,
            twitter: document.getElementById('twitter').value,
            instagram: document.getElementById('instagram').value
        };

        // Save to localStorage
        localStorage.setItem('contactInfo', JSON.stringify(updatedInfo));
        
        // Show success message
        const alertSuccess = document.getElementById('alert-success');
        if (alertSuccess) {
            alertSuccess.style.display = 'block';
            setTimeout(() => {
                alertSuccess.style.display = 'none';
            }, 3000);
        }

        // Force update all pages that might be open
        window.dispatchEvent(new Event('storage'));
    });
});