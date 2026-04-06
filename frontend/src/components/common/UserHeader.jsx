import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Home, BookOpen, Calendar, Ticket } from 'lucide-react';
import NotificationPanel from '../notifications/NotificationPanel';

const UserHeader = () => {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-[#241571] shadow-lg transition-all duration-300">
      <div className="flex h-20 w-full items-center justify-between px-12">

        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-md shadow-black/10 border border-white/5 overflow-hidden transition-transform hover:scale-105">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white leading-none">
              Uni<span className="text-blue-400">Ops</span>
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-tighter text-blue-300/60">Campus Hub</span>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Home className="h-4 w-4" /> Home
          </NavLink>
          <NavLink
            to="/resoursestudent"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <BookOpen className="h-4 w-4" /> Resources
          </NavLink>
          <NavLink
            to="/student-bookings"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Calendar className="h-4 w-4" /> Bookings
          </NavLink>
          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Ticket className="h-4 w-4" /> Tickets
          </NavLink>
        </nav>

        {/* Right Side: Login Button */}
        <div className="flex items-center gap-4">
          <NotificationPanel />

          <div className="h-8 w-px bg-white/10"></div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-4 py-2 font-bold transition-all duration-200 ${isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-950/40'
              }`
            }
          >
            Login
          </NavLink>
        </div>

      </div>
    </header>
  );
};

export default UserHeader;
