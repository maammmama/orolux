/**
 * Logout the current user and clean up auth state
 */
export async function logout() {
    try {
        // Try to logout on server
        await fetch('http://localhost:4000/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.warn('Server logout failed:', error);
    }

    // Clear all auth-related data
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminHash');
    localStorage.removeItem('loginRedirect');
    localStorage.removeItem('passwordResetToken');
    localStorage.removeItem('resetEmail');
    localStorage.removeItem('resetTokenTimestamp');
    localStorage.removeItem('passwordResetMethod');
    
    // Redirect to login
    window.location.href = '/my-watch-colne/frontend/src/views/admin/login.html';
}
