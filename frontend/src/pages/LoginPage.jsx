import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8085/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
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
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-slate-400 font-medium">
          Use your university Google account
        </p>
      </div>
    </div>
  );
}