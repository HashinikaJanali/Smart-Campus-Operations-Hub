import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, BellOff, Zap } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            if (Array.isArray(data)) {
                // Merge server data with local state to preserve manually marked items
                setNotifications(prevNotifications => {
                    const serverMap = new Map(data.map(n => [n.id, n]));
                    
                    // For each existing notification, keep its local read status if it was marked as read locally
                    const merged = prevNotifications.map(localN => {
                        const serverN = serverMap.get(localN.id);
                        if (!serverN) return localN; // Notification was deleted on server
                        
                        // If locally marked as read but server says unread, keep local state
                        if (localN.isRead && !serverN.isRead) {
                            return { ...serverN, isRead: true };
                        }
                        return serverN;
                    });
                    
                    // Add any new notifications from server
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
        fetchCurrentUser();
        
        // Poll for new notifications every 30 seconds to avoid overwriting local state too frequently
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const user = await notificationService.getCurrentUserInfo();
            if (user) {
                setCurrentUser(user);
                console.log('Current user from backend:', user);
                console.log('UserID from localStorage:', localStorage.getItem('userId'));
            }
        } catch (error) {
            console.error('Error fetching current user', error);
        }
    };

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
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    const handleTestNotification = async () => {
        try {
            const result = await notificationService.createTestNotification();
            if (result) {
                // Reload notifications to show the test notification
                await loadNotifications();
            }
        } catch (error) {
            console.error('Error creating test notification', error);
        }
    };

    // Safe unread count
    const unreadCount = Array.isArray(notifications)
        ? notifications.filter(n => !n.isRead).length
        : 0;

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
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="w-4 h-4 text-indigo-500" />
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-slate-400">
                                <BellOff className="w-8 h-8 mb-2 text-slate-300" />
                                <p className="text-sm font-medium mb-4">No notifications</p>
                                <button
                                    onClick={handleTestNotification}
                                    className="flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors mb-3"
                                    title="Create a test notification (dev only)"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                    Test Notification
                                </button>
                                {currentUser && (
                                    <div className="text-[10px] text-slate-400 mt-3 p-2 bg-slate-50 rounded border border-slate-200 max-w-xs">
                                        <p><strong>Debug Info:</strong></p>
                                        <p>Backend ID: {currentUser.mongodbId?.substring(0, 8)}...</p>
                                        <p>LocalStorage: {localStorage.getItem('userId')?.substring(0, 8)}...</p>
                                        <p>Match: {currentUser.mongodbId === localStorage.getItem('userId') ? '✓' : '✗'}</p>
                                    </div>
                                )}
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