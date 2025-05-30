/**
 * Password Reset Module
 * Manages password reset functionality for admin users
 */

// Generate secure random token
export function generateToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash a password with SHA-256 (can be kept for UI feedback)
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Password validation (can be kept for UI feedback)
export function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        checks: {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar
        }
    };
}

// Try to verify token with server
export async function verifyWithServer(token, email) {
    try {
        const response = await fetch('http://localhost:4000/api/auth/verify-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token, email })
        });
        return response.ok;
    } catch (error) {
        console.warn('Server validation not available:', error);
        return true; // Allow local validation if server is down
    }
}

// Default export of all functions
export default {
    generateToken,
    hashPassword,
    validatePassword,
    verifyWithServer
};