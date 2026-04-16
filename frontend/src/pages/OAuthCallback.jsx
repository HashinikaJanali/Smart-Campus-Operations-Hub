import { useEffect } from 'react';

function OAuthCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id    = params.get('id');
        const name  = params.get('name');
        const email = params.get('email');
        const role  = params.get('role');
        const error = params.get('error');

        if (error || !id) {
            window.location.href = '/login';
            return;
        }

        const user = { id, name, email, role };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('username', name);

        // Check if they were trying to do something before login
        const redirectTo = localStorage.getItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');

        if (redirectTo && redirectTo !== '/login') {
            window.location.href = redirectTo;
        } else if (role === 'ADMIN') {
            window.location.href = '/admin-dashboard';
        } else {
            window.location.href = '/';
        }
    }, []);

    return null;
}

export default OAuthCallback;