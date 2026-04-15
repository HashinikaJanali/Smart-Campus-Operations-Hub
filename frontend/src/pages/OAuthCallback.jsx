import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id    = params.get('id');
        const name  = params.get('name');
        const email = params.get('email');
        const role  = params.get('role');
        const error = params.get('error');

        console.log('OAuth Callback params:', { id, name, email, role });

        if (error || !id) {
            window.location.href = '/login';
            return;
        }

        const user = { id, name, email, role };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);

        console.log('User saved to localStorage:', user);

        // Use window.location.href instead of navigate
        // so the whole page reloads and header re-reads localStorage
        if (role === 'ADMIN') {
            window.location.href = '/resourseadmin';
        } else {
            window.location.href = '/';
        }

    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-500">
                Signing you in...
            </p>
        </div>
    );
}