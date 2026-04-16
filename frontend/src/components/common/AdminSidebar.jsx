import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Ticket,
    Menu,
    LogOut,
    Activity
} from 'lucide-react';
import logo from '../../assets/logo.png';

export default function AdminSidebar({ isOpen, onToggle, activePage }) {

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Analytics Dashboard',
            icon: Activity,
            path: '/admin-dashboard'
        },
        {
            id: 'resources',
            label: 'Resource Management',
            icon: LayoutDashboard,
            path: '/resourseadmin'
        },
        {
            id: 'bookings',
            label: 'Booking Management',
            icon: Calendar,
            path: '/admin-bookings'
        },
        {
            id: 'tickets',
            label: 'Ticket Management',
            icon: Ticket,
            path: '/admin-tickets'
        }
    ];

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#241571] bg-[#241571] shadow-sm text-white transition-all duration-300 ${isOpen ? 'w-[265px] p-5' : 'w-20 p-4 items-center'}`}
        >
            {/* Logo Section */}
            <div className={`mb-8 flex items-center border-b border-white/10 pb-5 w-full ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-md shadow-black/10 border border-white/5 overflow-hidden">
                            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <div className="overflow-hidden whitespace-nowrap text-left">
                            <div className="font-black tracking-tight text-white text-lg leading-none">
                                Uni<span className="text-blue-400">Ops</span>
                            </div>
                            <div className="mt-1 text-[10px] font-bold uppercase tracking-tighter text-blue-300/60">Admin Panel</div>
                        </div>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={`flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${isOpen ? 'h-8 w-8 text-blue-200 hover:bg-white/10 hover:text-white' : 'h-11 w-11 bg-white/10 text-white shadow-md shadow-black/10 hover:bg-white/20 border border-white/5'}`}
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 w-full space-y-1">
                {isOpen && (
                    <div className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/40">Core Management</div>
                )}

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={`flex items-center rounded-xl text-sm font-bold transition-all duration-200 ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} 
                                ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40 translate-x-1'
                                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                            {isOpen && <span className="overflow-hidden whitespace-nowrap">{item.label}</span>}
                        </NavLink>
                    );
                })}
            </div>

            {/* User Profile / Logout Section Footer */}
            <div className={`mt-auto flex items-center border-t border-white/10 pt-6 w-full ${isOpen ? 'gap-3 px-2' : 'justify-center'}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-lg shadow-black/20 ring-1 ring-white/10">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-xs font-black text-[#241571]">A</div>
                </div>

                {isOpen && (
                    <div className="overflow-hidden whitespace-nowrap flex-1 text-left">
                        <div className="text-sm font-semibold text-white leading-none">System Admin</div>
                        <div className="mt-1 text-[10px] text-blue-400/80 font-bold uppercase tracking-tight">Admin Account</div>
                    </div>
                )}

                {isOpen && (
                    <button
                        className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-blue-300 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 shadow-sm"
                        title="Log out"
                    >
                        <LogOut className="h-4 w-4 transition-colors duration-200 group-hover:text-rose-500" />
                    </button>
                )}
            </div>
        </aside>
    );
}
