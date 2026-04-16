const API_URL = 'http://localhost:8085/api/auth';

const authService = {

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn: () => !!localStorage.getItem('user'),

    getRole: () => localStorage.getItem('role'),

    isAdmin: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.role === 'ADMIN';
    },

    isTechnician: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.role === 'TECHNICIAN';
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
            window.location.href = '/login';
        }
    }
};

export default authService;