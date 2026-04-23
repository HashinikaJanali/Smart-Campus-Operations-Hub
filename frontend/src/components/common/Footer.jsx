import React from 'react';
import logo from '../../assets/logo.png';

const Footer = () => (
  <footer className="bg-slate-50 py-10 border-t border-slate-100">
    <div className="mx-auto max-w-7xl px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 shadow-sm border border-indigo-100 overflow-hidden">
          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-800">
          Uni<span className="text-indigo-600">Ops</span>
        </span>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
        © 2026 Smart Campus Operations Hub
      </p>
    </div>
  </footer>
);

export default Footer;
