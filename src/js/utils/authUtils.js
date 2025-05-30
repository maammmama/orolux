/**
 * Authentication Utilities
 * Handles authentication checks and session validation for admin pages
 */

// Get the API URL based on environment
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://backend-rnewxlt55-hazas-projects-7feda15e.vercel.app';

// Session validation function
export async function validateSession() {
    try {
        // First try server validation
        const response = await fetch(`${API_URL}/api/auth/check-session`, {
            credentials: 'include'  // Include cookies for session validation
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.authenticated;
        }
    } catch (error) {
        console.warn('Server validation not available:', error);
    }

    // Fallback to local session check
    const adminSession = document.cookie.includes('admin_session=');
    const admin2FA = document.cookie.includes('admin_2fa=');
    
    // For the demo, also check localStorage as a fallback
    const hasLocalAuth = localStorage.getItem('adminUsername') && localStorage.getItem('adminHash');

    return (adminSession && admin2FA) || hasLocalAuth;
}

// Protect page from unauthorized access
export async function protectPage() {
    // Skip auth check for login and password reset pages
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') || 
        currentPath.includes('forgot-password.html') || 
        currentPath.includes('new-password.html')) {
        return true;
    }    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
        // Store current URL to redirect back after login
        localStorage.setItem('loginRedirect', currentPath);
        window.location.href = '/src/views/admin/login.html';
        return false;
    }
    return true;
}
