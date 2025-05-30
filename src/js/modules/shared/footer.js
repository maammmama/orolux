document.addEventListener('DOMContentLoaded', function() {
    function updateSocialLinks() {
        // Get social links from localStorage
        const info = JSON.parse(localStorage.getItem('contactInfo') || '{}');
        
        // Update Facebook link
        const fbLink = document.getElementById('footer-facebook');
        if (fbLink && info.facebook) {
            fbLink.href = info.facebook;
        }

        // Update Twitter link 
        const twitterLink = document.getElementById('footer-twitter');
        if (twitterLink && info.twitter) {
            twitterLink.href = info.twitter;
        }

        // Update Instagram link
        const instaLink = document.getElementById('footer-instagram');
        if (instaLink && info.instagram) {
            instaLink.href = info.instagram;
        }
    }

    // Update links immediately
    updateSocialLinks();

    // Listen for localStorage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'contactInfo') {
            updateSocialLinks();
        }
    });
});