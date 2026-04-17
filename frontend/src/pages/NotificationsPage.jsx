import React, { useState, useEffect } from 'react';
import UserHeader from '../components/common/UserHeader';
import {
    Loader2, CheckCheck, Trash2, BellOff,
    CheckCircle2, XCircle, Calendar, Ticket,
    MessageCircle, Info, ChevronRight, ExternalLink
} from 'lucide-react';
import notificationService from '../services/notificationService';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

const getTypeConfig = (type) => {
    switch (type) {
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

    useEffect(() => { loadNotifications(); }, []);

    const loadNotifications = async () => {
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
    };

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

    const filtered = filter === 'ALL'
        ? notifications
        : filter === 'UNREAD'
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.isRead);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <UserHeader />
            <main className="mx-auto max-w-6xl px-6 py-10">

                {/* Page header */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                <div className="flex gap-2 mb-5 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-sm">
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
                    /* Split panel layout */
                    <div className="flex gap-4 items-start">

                        {/* Left: Notification list */}
                        <div className="w-80 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            {filtered.map((n, idx) => {
                                const tc = getTypeConfig(n.type);
                                const isSelected = selected?.id === n.id;
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => selectNotification(n, notifications)}
                                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors border-b border-slate-100 last:border-b-0 ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white'
                                                : !n.isRead
                                                    ? 'bg-indigo-50 hover:bg-indigo-100'
                                                    : 'bg-white hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {!n.isRead && !isSelected && (
                                                <span className="block w-2 h-2 rounded-full bg-indigo-600 mt-1" />
                                            )}
                                            {(n.isRead || isSelected) && (
                                                <span className={`block w-2 h-2 rounded-full ${isSelected ? 'bg-white/40' : 'bg-slate-200'}`} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                {tc.label}
                                            </p>
                                            <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                                {n.message}
                                            </p>
                                            <p className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                                                {timeAgo(n.createdAt)}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: Full notification detail */}
                        <div className="flex-1 min-w-0">
                            {selected ? (
                                <DetailPanel
                                    notification={selected}
                                    onDelete={(id, e) => handleDelete(id, e)}
                                    onMarkRead={(id, e) => handleMarkRead(id, e)}
                                    navigate={navigate}
                                />
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center py-24 text-slate-400">
                                    <Info className="w-10 h-10 mb-3 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-500">Select a notification to view</p>
                                    <p className="text-xs mt-1">Click any notification on the left</p>
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

            {/* Breadcrumb */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline"
                    onClick={() => navigate('/notifications')}>
                    Notifications
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-bold text-indigo-600">{tc.section}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">{tc.label}</span>
            </div>

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${tc.bg} border ${tc.border}`}>
                        {tc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${tc.bg} ${tc.color} ${tc.border}`}>
                                {tc.label}
                            </span>
                            {!n.isRead && (
                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                                    New
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 font-medium">
                            {new Date(n.createdAt).toLocaleString()} · {timeAgo(n.createdAt)}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.isRead && (
                            <button
                                onClick={(e) => onMarkRead(n.id, e)}
                                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Mark as read"
                            >
                                <CheckCheck className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={(e) => onDelete(n.id, e)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Message body */}
            <div className="px-6 py-6">
                <p className="text-sm font-bold text-slate-800 leading-relaxed text-base">
                    {n.message}
                </p>
            </div>

            {/* Go to destination */}
            {tc.destination && (
                <div className="px-6 pb-6">
                    <button
                        onClick={() => navigate(tc.destination.path)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        {tc.destination.label}
                    </button>
                </div>
            )}
        </div>
    );
}
