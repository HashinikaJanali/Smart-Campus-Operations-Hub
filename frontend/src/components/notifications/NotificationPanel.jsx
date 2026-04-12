import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, BellOff } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications', error);
        }
    };

    const handleMarkRead = async (id) => {
        await notificationService.markAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getTypeColor = (type) => {
        switch (type) {
            case 'BOOKING_APPROVED': return 'text-emerald-600 bg-emerald-50';
            case 'BOOKING_REJECTED': return 'text-rose-600 bg-rose-50';
            case 'TICKET_STATUS_CHANGED': return 'text-indigo-600 bg-indigo-50';
            case 'NEW_COMMENT': return 'text-amber-600 bg-amber-50';
            default: return 'text-slate-500 bg-slate-100';
        }
    };

    return (
        <div className="relative" ref={panelRef}>

            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">

                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-600" />
                            <span className="font-black text-sm text-slate-800">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <BellOff className="w-8 h-8 mb-2 text-slate-300" />
                                <p className="text-sm font-medium">No notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 8).map(n => (
                                <div
                                    key={n.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="mt-1.5 flex-shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-slate-200' : 'bg-indigo-600'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getTypeColor(n.type)}`}>
                                            {n.type?.replace(/_/g, ' ')}
                                        </span>
                                        <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed line-clamp-2">
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => handleMarkRead(n.id)}
                                            className="flex-shrink-0 p-1 rounded-lg hover:bg-indigo-100 transition-colors mt-1"
                                            title="Mark as read"
                                        >
                                            <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-100">
                            <button
                                onClick={() => { navigate('/notifications'); setOpen(false); }}
                                className="w-full py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors text-center"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}