import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, User, LayoutDashboard, Home, BookOpen, Calendar, Ticket } from 'lucide-react';

const UserHeader = () => {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="flex h-20 w-full items-center justify-between px-12">
        
        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-200 transition-transform hover:scale-105">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">
            Uni<span className="text-indigo-600">Ops</span>
          </span>
        </div>

        {/* Middle: Navigation Links */}
        <nav className="flex items-center gap-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Home className="h-4 w-4" /> Home
          </NavLink>
          <NavLink 
            to="/resoursestudent" 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <BookOpen className="h-4 w-4" /> Resources
          </NavLink>
          <NavLink 
            to="/student-bookings" 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Calendar className="h-4 w-4" /> Bookings
          </NavLink>
          <NavLink 
            to="/tickets" 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Ticket className="h-4 w-4" /> Tickets
          </NavLink>
        </nav>

        {/* Right Side: Notification & Profile */}
        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1 pr-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-slate-700">John Doe</span>
              <span className="text-[10px] font-medium text-slate-400">Student Profile</span>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};

export default UserHeader;
