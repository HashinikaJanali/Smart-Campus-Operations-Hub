const API_URL = 'http://localhost:8085/api/auth';

const authService = {

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn: () => !!localStorage.getItem('user'),

    getRole: () => localStorage.getItem('role'),

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