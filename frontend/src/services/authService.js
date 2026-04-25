const API_URL = 'http://localhost:8085/api/auth';

const authService = {

    // Returns the parsed user object stored by OAuthCallback after login, or null if not authenticated
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Quick boolean check for session presence without parsing JSON
    isLoggedIn: () => !!localStorage.getItem('user'),

    // Returns the raw role string (USER / ADMIN / TECHNICIAN) stored at login time
    getRole: () => localStorage.getItem('role'),

    // Validates that the stored user has the ADMIN role; returns false on missing or malformed data
    isAdmin: () => {
        try {
            const user = localStorage.getItem('user');
            if (!user) return false;
            const parsed = JSON.parse(user);
            return parsed?.role === 'ADMIN';
        } catch (e) {
            return false;
        }
    },

    // Validates that the stored user has the TECHNICIAN role; returns false on missing or malformed data
    isTechnician: () => {
        try {
            const user = localStorage.getItem('user');
            if (!user) return false;
            const parsed = JSON.parse(user);
            return parsed?.role === 'TECHNICIAN';
        } catch (e) {
            return false;
        }
    },

    logout: async () => {
        try {
            // Tell Spring Boot to end the session
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            // Always clear localStorage regardless
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');
            window.location.href = '/';
        }
    }
};

export default authService;