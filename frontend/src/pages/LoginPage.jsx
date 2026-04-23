import React from 'react';
import { ShieldCheck } from 'lucide-react';
import UserHeader from '../components/common/UserHeader';
import Footer from '../components/common/Footer';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8085/oauth2/authorization/google?prompt=select_account';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <UserHeader />

      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-8 py-12 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">

          <div className="flex justify-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
              <ShieldCheck className="h-7 w-7 text-indigo-600" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">
            Welcome to Uni<span className="text-indigo-600">Ops</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mb-8">
            Smart Campus Operations Hub
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-xs text-slate-400 font-medium">
            Use your university Google account
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
