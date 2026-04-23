import React, { useState, useEffect, useRef } from 'react';
import {
    Bell, CheckCheck, X, BellOff, Zap, Settings,
    CheckCircle2, XCircle, Calendar, Ticket, MessageCircle, Info
} from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

const formatType = (type) => {
    return type?.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ') || 'Notification';
};

const getTypeIcon = (type) => {
    switch (type) {
        case 'BOOKING_APPROVED':
            return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case 'BOOKING_REJECTED':
            return <XCircle className="w-4 h-4 text-rose-500" />;
        case 'BOOKING_CANCELLED':
            return <Calendar className="w-4 h-4 text-slate-400" />;
        case 'TICKET_STATUS_CHANGED':
            return <Ticket className="w-4 h-4 text-indigo-500" />;
        case 'NEW_COMMENT':
            return <MessageCircle className="w-4 h-4 text-amber-500" />;
        default:
            return <Info className="w-4 h-4 text-slate-400" />;
    }
};

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();
    const readStatusMapRef = useRef(new Map()); // Track when items were marked as read

    const loadSettings = async () => {
        try {
            const data = await notificationService.getSettings();
            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading settings', error);
        }
    };

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            if (Array.isArray(data)) {
                // Merge server data with local state to preserve manually marked items
                setNotifications(prevNotifications => {
                    const serverMap = new Map(data.map(n => [n.id, n]));
                    const now = Date.now();

                    const merged = prevNotifications.map(localN => {
                        const serverN = serverMap.get(localN.id);
                        if (!serverN) return localN;
                        
                        // Check if this notification was recently marked as read locally
                        const readTime = readStatusMapRef.current.get(localN.id);
                        if (readTime && (now - readTime) < 5000) {
                            // Keep local read status for 5 seconds after marking
                            return { ...serverN, isRead: localN.isRead };
                        }
                        
                        return serverN;
                    });

                    const localIds = new Set(prevNotifications.map(n => n.id));
                    const newNotifications = data.filter(n => !localIds.has(n.id));

                    return [...merged, ...newNotifications];
                });
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error loading notifications', error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        loadNotifications();
        loadSettings();

        const interval = setInterval(() => {
            loadNotifications();
            loadSettings();
        }, 30000);
        return () => clearInterval(interval);
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

    const handleMarkAllRead = async () => {
        try {
            // Record when we marked all notifications as read
            setNotifications(prev => {
                const now = Date.now();
                prev.forEach(n => {
                    if (!n.isRead) {
                        readStatusMapRef.current.set(n.id, now);
                    }
                });
                return prev.map(n => ({ ...n, isRead: true }));
            });
            
            // Make the server request
            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            // Record when we marked this notification as read
            readStatusMapRef.current.set(id, Date.now());
            
            // Update local state immediately
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            
            // Make the server request
            await notificationService.markAsRead(id);
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const handleTestNotification = async () => {
        try {
            const result = await notificationService.createTestNotification();
            if (result) {
                await loadNotifications();
            }
        } catch (error) {
            console.error('Error creating test notification', error);
        }
    };

    const unreadCount = Array.isArray(notifications)
        ? notifications.filter(n => !n.isRead).length
        : 0;

    return (
        <div className="relative" ref={panelRef}>

            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all shadow-sm font-medium ${
                    settings?.disableAll 
                        ? 'border-amber-200 bg-amber-50 hover:bg-amber-100' 
                        : 'border-indigo-200 bg-white hover:shadow-md'
                }`}
                title={settings?.disableAll ? 'Notifications disabled' : 'Notifications'}
            >
                <Bell className={`w-5 h-5 ${
                    settings?.disableAll ? 'text-amber-600' : 'text-indigo-600'
                }`} />
                {!settings?.disableAll && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-12 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">

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
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleMarkAllRead}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Mark all as read"
                            >
                                <CheckCheck className="w-4 h-4 text-indigo-500" />
                            </button>
                            <button
                                onClick={() => { navigate('/notifications/settings'); setOpen(false); }}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Notification settings"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Close"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {settings?.disableAll && (
                            <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-base mt-0.5">🔔</span>
                                    <div>
                                        <p className="text-xs font-bold text-amber-900">
                                            Notifications Disabled
                                        </p>
                                        <p className="text-[10px] text-amber-800 mt-0.5">
                                            You won't receive new notifications. Enable in settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-slate-400">
                                <BellOff className="w-8 h-8 mb-3 text-slate-300" />
                                <p className="text-sm font-bold text-slate-600">No notifications yet</p>
                                <p className="text-[10px] text-slate-500 mt-1">You're all caught up!</p>
                                <button
                                    onClick={handleTestNotification}
                                    className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
                                    title="Create a test notification (dev only)"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                    Test Notification
                                </button>
                            </div>
                        ) : (
                            notifications.slice(0, 8).map(n => (
                                <div
                                    key={n.id}
                                    className={`px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                                        !n.isRead ? 'bg-indigo-50' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Type icon */}
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getTypeIcon(n.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 leading-tight">
                                                        {formatType(n.type)}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1.5">
                                                        {timeAgo(n.createdAt)}
                                                    </p>
                                                </div>
                                                {!n.isRead && (
                                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-1" />
                                                )}
                                            </div>
                                            <div className="flex gap-2 mt-2.5 pt-2 border-t border-slate-100">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => handleMarkRead(n.id)}
                                                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800"
                                                        title="Mark as read"
                                                    >
                                                        Mark read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { navigate(`/notifications?id=${n.id}`); setOpen(false); }}
                                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 ml-auto"
                                                >
                                                    View full notification
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* See all footer */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                        <button
                            onClick={() => { navigate('/notifications'); setOpen(false); }}
                            className="w-full py-2 rounded-lg text-sm font-bold text-indigo-600 hover:bg-white hover:shadow-sm transition-all text-center"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
