import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, Ticket, LogOut, ShieldCheck, User, ChevronDown, Bell } from 'lucide-react';
import NotificationPanel from '../notifications/NotificationPanel';
import authService from '../../services/authService';
import logo from '../../assets/logo.png';

const UserHeader = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const isLoggedIn = authService.isLoggedIn();
  const isAdmin = authService.isAdmin();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await authService.logout();
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-[#241571] shadow-lg transition-all duration-300">
      <div className="flex h-20 w-full items-center justify-between px-12">

        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 shadow-md shadow-black/10 border border-white/5 overflow-hidden transition-transform hover:scale-105">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white leading-none">
              Uni<span className="text-blue-400">Ops</span>
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-tighter text-blue-300/60">Campus Hub</span>
          </div>
        </div>

        {/* Middle: Navigation — always show all tabs */}
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
            to="/bookings"
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

          {/* Admin only links */}
          {isAdmin && (
            <>
              <NavLink
                to="/resourseadmin"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40'
                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40'
                    : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Users
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <NotificationPanel />
              <div className="h-8 w-px bg-white/10"></div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white hidden md:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-blue-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl shadow-black/20 border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <span className={`mt-2 inline-flex text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        user?.role === 'ADMIN'
                          ? 'bg-indigo-100 text-indigo-600'
                          : user?.role === 'TECHNICIAN'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { navigate('/notifications'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Bell className="h-4 w-4 text-slate-400" />
                        Notifications
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { navigate('/admin/users'); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <User className="h-4 w-4 text-slate-400" />
                          Manage Users
                        </button>
                      )}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="h-8 w-px bg-white/10"></div>
              <NavLink
                to="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-950/40 transition-all duration-200"
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;