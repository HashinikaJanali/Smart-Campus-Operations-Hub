import React, { useState, useEffect } from 'react';
import UserHeader from '../components/common/UserHeader';
import { Bell, Loader2, CheckCheck, Trash2, BellOff } from 'lucide-react';
import notificationService from '../services/notificationService';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => { loadNotifications(); }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getMyNotifications();
            // Make sure it's always an array
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading notifications', error);
            setNotifications([]);
        } finally {
            setLoading(false);
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

    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unread = notifications.filter(n => !n.isRead);
            await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    const getTypeConfig = (type) => {
        switch (type) {
            case 'BOOKING_APPROVED':
                return { label: 'Booking Approved', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'BOOKING_REJECTED':
                return { label: 'Booking Rejected', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
            case 'BOOKING_CANCELLED':
                return { label: 'Booking Cancelled', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
            case 'TICKET_STATUS_CHANGED':
                return { label: 'Ticket Updated', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
            case 'NEW_COMMENT':
                return { label: 'New Comment', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
            default:
                return { label: 'Notification', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };

    const filtered = filter === 'ALL'
        ? notifications
        : filter === 'UNREAD'
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.isRead);

    const unreadCount = Array.isArray(notifications)
        ? notifications.filter(n => !n.isRead).length
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <UserHeader />
            <main className="mx-auto max-w-4xl px-8 py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 italic">
                            My <span className="text-indigo-600">Notifications</span>
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <CheckCheck className="w-4 h-4" /> Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-sm">
                    {['ALL', 'UNREAD', 'READ'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filter === f
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                        <BellOff className="w-16 h-16 mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-600">No Notifications</h3>
                        <p className="text-sm mt-2">Nothing here yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(n => {
                            const tc = getTypeConfig(n.type);
                            return (
                                <div
                                    key={n.id}
                                    className={`flex items-start gap-4 bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${n.isRead ? 'border-slate-200' : 'border-indigo-200 shadow-sm shadow-indigo-100/50'}`}
                                >
                                    {/* Unread dot */}
                                    <div className="mt-1 flex-shrink-0">
                                        <div className={`w-2.5 h-2.5 rounded-full ${n.isRead ? 'bg-slate-200' : 'bg-indigo-600'}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>
                                                {tc.label}
                                            </span>
                                            {!n.isRead && (
                                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${n.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => handleMarkRead(n.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(n.id)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}