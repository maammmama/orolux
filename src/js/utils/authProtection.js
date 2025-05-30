// Immediately invoke auth protection
import { protectPage } from '/my-watch-colne/frontend/src/js/utils/authUtils.js';

// Execute auth check immediately when script loads
(async () => {
    try {
        await protectPage();
    } catch (error) {
        console.error('Authentication error:', error);
        window.location.href = '/my-watch-colne/frontend/src/views/admin/login.html';
    }
})();
