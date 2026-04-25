import React, { useState, useEffect, useCallback } from 'react';
import UserHeader from '../components/common/UserHeader';
import {
    Loader2, CheckCheck, Trash2, BellOff, Bell,
    CheckCircle2, XCircle, Calendar, Ticket,
    MessageCircle, Info, ExternalLink
} from 'lucide-react';
import notificationService from '../services/notificationService';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Converts a UTC timestamp into a human-readable relative label (e.g. "3 minutes ago")
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

// Maps each backend notification type enum to its display label, color theme, icon, and navigation destination
const getTypeConfig = (type) => {
    switch (type) {
        case 'BOOKING_REQUESTED':
            return {
                label: 'Booking Requested',
                color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
                icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
                section: 'Bookings',
                destination: { label: 'View in Bookings', path: '/bookings' }
            };
        case 'BOOKING_APPROVED':
            return {
                label: 'Booking Approved',
                color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                section: 'Bookings',
                destination: { label: 'View in Bookings', path: '/bookings' }
            };
        case 'BOOKING_REJECTED':
            return {
                label: 'Booking Rejected',
                color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
                icon: <XCircle className="w-5 h-5 text-rose-500" />,
                section: 'Bookings',
                destination: { label: 'View in Bookings', path: '/bookings' }
            };
        case 'BOOKING_CANCELLED':
            return {
                label: 'Booking Cancelled',
                color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200',
                icon: <Calendar className="w-5 h-5 text-slate-400" />,
                section: 'Bookings',
                destination: { label: 'View in Bookings', path: '/bookings' }
            };
        case 'TICKET_RAISED':
            return {
                label: 'Ticket Raised',
                color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200',
                icon: <Ticket className="w-5 h-5 text-rose-500" />,
                section: 'Tickets',
                destination: { label: 'View in Tickets', path: '/tickets' }
            };
        case 'TICKET_STATUS_CHANGED':
            return {
                label: 'Ticket Updated',
                color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200',
                icon: <Ticket className="w-5 h-5 text-indigo-500" />,
                section: 'Tickets',
                destination: { label: 'View in Tickets', path: '/tickets' }
            };
        case 'NEW_COMMENT':
            return {
                label: 'New Comment',
                color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
                icon: <MessageCircle className="w-5 h-5 text-amber-500" />,
                section: 'Tickets',
                destination: { label: 'View in Tickets', path: '/tickets' }
            };
        default:
            return {
                label: 'Notification',
                color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200',
                icon: <Info className="w-5 h-5 text-slate-400" />,
                section: 'General',
                destination: null
            };
    }
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Fetches notifications from the API and auto-selects one when ?id= is present in the URL
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await notificationService.getMyNotifications();
            const list = Array.isArray(data) ? data : [];
            setNotifications(list);

            // Auto-select from URL param ?id=
            const paramId = searchParams.get('id');
            if (paramId) {
                const found = list.find(n => n.id === paramId);
                if (found) selectNotification(found, list);
            }
        } catch (error) {
            console.error('Error loading notifications', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => { loadNotifications(); }, [loadNotifications, searchParams]);

    // Selects a notification for the detail panel and auto-marks it as read on first open
    const selectNotification = async (n, list) => {
        setSelected(n);
        if (!n.isRead) {
            try {
                await notificationService.markAsRead(n.id);
                setNotifications(prev =>
                    prev.map(item => item.id === n.id ? { ...item, isRead: true } : item)
                );
                setSelected(prev => prev ? { ...prev, isRead: true } : prev);
            } catch (e) {
                console.error('Error marking as read', e);
            }
        }
    };

    // Marks a single notification as read; stopPropagation prevents triggering the row's select handler
    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            if (selected?.id === id) setSelected(prev => ({ ...prev, isRead: true }));
        } catch (error) {
            console.error('Error marking as read', error);
        }
    };

    // Deletes a notification; clears the detail panel if the deleted item was selected
    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (error) {
            console.error('Error deleting notification', error);
        }
    };

    // Marks all unread notifications as read in parallel
    const handleMarkAllRead = async () => {
        try {
            const unread = notifications.filter(n => !n.isRead);
            await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            if (selected) setSelected(prev => ({ ...prev, isRead: true }));
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    // Applies the active read-status filter (ALL / UNREAD / READ) to the full notification list
    const filtered = filter === 'ALL'
        ? notifications
        : filter === 'UNREAD'
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.isRead);

    // Used for the summary header text and to conditionally show the "mark all as read" button
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-900">
            <UserHeader />
            <main className="mx-auto max-w-7xl px-6 py-12">

                {/* Professional Page header */}
                <div className="mb-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">
                                Notifications
                            </h1>
                            <p className="text-base font-medium text-slate-600 mt-2">
                                {unreadCount > 0 
                                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                                    : '✓ You\'re all caught up!'}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <CheckCheck className="w-4 h-4" /> Mark all as read
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
                    {['ALL', 'UNREAD', 'READ'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                filter === f
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <BellOff className="w-16 h-16 mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-700 mt-2">No Notifications</h3>
                        <p className="text-slate-500 mt-2">{filter === 'UNREAD' ? 'All notifications are marked as read' : 'No notifications at this time'}</p>
                        {filter !== 'ALL' && (
                            <button
                                onClick={() => setFilter('ALL')}
                                className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-colors"
                            >
                                View all notifications
                            </button>
                        )}
                    </div>
                ) : (
                    /* Split panel layout */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Left: Notification list */}
                        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
                            {filtered.map((n, idx) => {
                                const tc = getTypeConfig(n.type);
                                const isSelected = selected?.id === n.id;
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => selectNotification(n, notifications)}
                                        className={`w-full text-left px-4 py-4 flex items-start gap-3 transition-all border-b border-slate-100 last:border-b-0 ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : !n.isRead
                                                    ? 'bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200'
                                                    : 'bg-white hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 flex h-3 w-3 items-center justify-center rounded-full ${
                                            !n.isRead ? (isSelected ? 'bg-white/60' : 'bg-indigo-600') : (isSelected ? 'bg-white/40' : 'bg-slate-200')
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                {tc.label}
                                            </p>
                                            <p className={`text-xs mt-1.5 truncate leading-relaxed ${isSelected ? 'text-indigo-100' : 'text-slate-600'}`}>
                                                {n.message}
                                            </p>
                                            <p className={`text-[11px] mt-2 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {timeAgo(n.createdAt)}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: Full notification detail */}
                        <div className="lg:col-span-2">
                            {selected ? (
                                <DetailPanel
                                    notification={selected}
                                    onDelete={(id, e) => handleDelete(id, e)}
                                    onMarkRead={(id, e) => handleMarkRead(id, e)}
                                    navigate={navigate}
                                />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-20">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                                        <Info className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-700">Select a notification</p>
                                    <p className="text-slate-500 mt-2">Click on any notification to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function DetailPanel({ notification: n, onDelete, onMarkRead, navigate }) {
    const tc = getTypeConfig(n.type);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Header with icon and metadata */}
            <div className={`px-6 py-6 border-b border-slate-100 ${tc.bg}`}>
                <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${tc.bg} border ${tc.border}`}>
                        {tc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${tc.bg} ${tc.color} ${tc.border}`}>
                                {tc.label}
                            </span>
                            {!n.isRead && (
                                <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-600 text-white">
                                    ● New
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 mt-3 font-medium">
                            {new Date(n.createdAt).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!n.isRead && (
                            <button
                                onClick={(e) => onMarkRead(n.id, e)}
                                className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Mark as read"
                            >
                                <CheckCheck className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={(e) => onDelete(n.id, e)}
                            className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Message content */}
            <div className="px-6 py-8 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                    {tc.label}
                </h2>
                <p className="text-slate-700 leading-relaxed text-base">
                    {n.message}
                </p>
            </div>

            {/* Call to action */}
            {tc.destination && (
                <div className="px-6 py-6 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={() => navigate(tc.destination.path)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {tc.destination.label}
                    </button>
                </div>
            )}
        </div>
    );
}
