import React, { useState, useEffect } from 'react';
import {
    Clock, CheckCircle2, XCircle, MapPin,
    CalendarDays, Eye, Loader2, ArrowRight, Search,
    SlidersHorizontal, Filter, Database, RefreshCcw,
    ChevronLeft, ChevronRight, Building2, FlaskConical, Users, MonitorPlay, Trash2, AlertTriangle
} from 'lucide-react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../services/bookingService';
import ReviewModal from '../components/booking/ReviewModal';
import { useNotificationRefresh } from '../contexts/NotificationContext';
import { useToast } from '../contexts/ToastContext';

import AdminSidebar from '../components/common/AdminSidebar';

export default function AdminBookingPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { refreshNotifications } = useNotificationRefresh();
    const { showToast } = useToast();

    // Filter States
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('ALL');
    const [dateF, setDateF] = useState('');
    const [timeF, setTimeF] = useState('');

    useEffect(() => { loadAllBookings(); }, []);
    useEffect(() => { setCurrentPage(1); }, [search, statusF, dateF, timeF]);

    const loadAllBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to load generic bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (id, status, reason) => {
        try {
            setProcessing(true);
            await updateBookingStatus(id, status, reason);
            setReviewing(null);
            loadAllBookings();
            refreshNotifications();
            showToast(
                status === 'APPROVED' ? 'Booking approved successfully.' : 'Booking rejected.',
                status === 'APPROVED' ? 'success' : 'info'
            );
        } catch (error) {
            showToast(error.response?.data || 'Failed to update status', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const triggerDelete = (id) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            setProcessing(true);
            await deleteBooking(deleteConfirmId);
            loadAllBookings();
            refreshNotifications();
            showToast('Booking deleted successfully.', 'success');
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to delete booking', 'error');
        } finally {
            setProcessing(false);
            setDeleteConfirmId(null);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatusF('ALL');
        setDateF('');
        setTimeF('');
    };

    // Stats Calculation
    const stats = [
        { label: 'Total Requests', count: bookings.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Pending Review', count: bookings.filter(b => b.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { label: 'Total Approved', count: bookings.filter(b => b.status === 'APPROVED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Rejected / Cancelled', count: bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ];

    // Multi-filtering logic
    const displayed = bookings.filter(b => {
        const matchesSearch = !search ||
            (b.resourceName || '').toLowerCase().includes(search.toLowerCase()) ||
            (b.userId || '').toLowerCase().includes(search.toLowerCase()) ||
            b.id.toString() === search;

        const matchesStatus = statusF === 'ALL' || b.status === statusF;
        const matchesDate = !dateF || b.bookingDate === dateF;
        const matchesTime = !timeF || (b.startTime || '').includes(timeF);

        return matchesSearch && matchesStatus && matchesDate && matchesTime;
    }).sort((a, b) => b.id.localeCompare(a.id));

    const totalPages = Math.ceil(displayed.length / itemsPerPage);
    const paginated = displayed.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <AdminSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activePage="bookings"
            />

            {/* ── MAIN CONTENT ── */}
            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>

                {/* Header Section */}
                <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                            <Clock className="w-3.5 h-3.5" /> Operations Hub
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            Booking <span className="text-indigo-600">Management</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Monitor and manage resource bookings in real-time.</p>
                    </div>
                    <button 
                        onClick={loadAllBookings} 
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all active:scale-95 shadow-sm shadow-indigo-200/40"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div key={idx} className={`bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm shadow-indigo-500/5 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-3xl font-extrabold ${s.color}`}>{s.count}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500">{s.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Filter Section Container */}
                <div className="bg-white rounded-xl border border-indigo-100 p-4 mb-6 shadow-sm shadow-indigo-500/5">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-bold text-slate-500 uppercase">Filters:</span>
                        </div>

                        {/* Search */}
                        <div className="relative group w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search User ID or Resource..."
                                className="w-full pl-11 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-100 transition-all font-normal"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[150px]">
                            <select
                                className="w-full pl-4 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-normal text-slate-700 outline-none focus:border-indigo-500 focus:bg-white appearance-none cursor-pointer transition-all"
                                value={statusF}
                                onChange={(e) => setStatusF(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Date Filter */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date:</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="pl-4 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-normal text-slate-700 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition-all"
                                    value={dateF}
                                    onChange={(e) => setDateF(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Time Filter */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time:</span>
                            <div className="relative">
                                <input
                                    type="time"
                                    className="pl-4 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-normal text-slate-700 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition-all"
                                    value={timeF}
                                    onChange={(e) => setTimeF(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Clear Button - Indigo Theme Secondary Style */}
                        <div className="ml-auto">
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-bold text-indigo-700 shadow-sm shadow-indigo-200/40 transition-all hover:bg-indigo-100 active:scale-95"
                            >
                                <RefreshCcw className="w-3.5 h-3.5" /> Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table View Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                        <span className="flex items-center gap-2 font-bold text-slate-900">
                             <Database className="h-5 w-5 text-indigo-600" /> Booking Ledger
                        </span>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{displayed.length} items</span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                <p className="mt-4 text-sm font-medium text-slate-500">Synchronizing records...</p>
                            </div>
                        ) : displayed.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <Search className="mb-4 h-12 w-12 text-slate-300" />
                                <div className="text-lg font-bold text-slate-900">No match found</div>
                                <div className="mt-1 text-sm text-slate-500">Try adjusting your filters</div>
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-3">Resource Info</th>
                                        <th className="px-6 py-3">Requester</th>
                                        <th className="px-6 py-3 text-center">Schedule</th>
                                        <th className="px-6 py-3 text-center">Check-in</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                     {paginated.map((req) => {
                                         // Resource Type Icon Mapping with Name Fallback
                                         const getResourceIcon = (b) => {
                                             const type = b.resourceType;
                                             const name = (b.resourceName || '').toUpperCase();

                                             if (type === 'LECTURE_HALL' || name.includes('HALL') || name.includes('LECTURE')) return Building2;
                                             if (type === 'LAB' || name.includes('LAB')) return FlaskConical;
                                             if (type === 'MEETING_ROOM' || name.includes('ROOM') || name.includes('MEETING')) return Users;
                                             if (type === 'EQUIPMENT' || name.includes('EQUIP')) return MonitorPlay;

                                             return MapPin;
                                         };
                                         const ResourceIcon = getResourceIcon(req);

                                         return (
                                             <tr key={req.id} className="group border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                                                 <td className="px-6 py-4">
                                                     <div className="flex items-center gap-3">
                                                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm transition-transform group-hover:scale-105">
                                                             <ResourceIcon className="h-5 w-5" />
                                                         </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold text-slate-900 truncate tracking-tight">{req.resourceName || `Resource #${req.resourceId}`}</div>
                                                        <div className="text-xs text-slate-400">ID #{req.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700 tracking-tight">{req.userName ? req.userName : 'Unknown User'}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">ID: {req.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <CalendarDays className="h-3.5 w-3.5 text-indigo-400" /> {req.bookingDate}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                        <Clock className="h-3 w-3 text-slate-300" /> {req.startTime} — {req.endTime}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {req.checkedIn ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-medium">
                                                            {req.checkInTime ? new Date(req.checkInTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border shadow-sm
                                                    ${req.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                        req.status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                                            req.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                                'bg-slate-100 border-slate-200 text-slate-600'}`
                                                }>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${req.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                            req.status === 'REJECTED' ? 'bg-rose-500' :
                                                                req.status === 'PENDING' ? 'bg-amber-500 animate-pulse' :
                                                                    'bg-slate-500'
                                                        }`} />
                                                     {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setReviewing(req)}
                                                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-[11px] font-bold shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 ${req.status === 'PENDING' ? 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/20'}`}
                                                    >
                                                        {req.status === 'PENDING' ? (
                                                            <>REVIEW <ArrowRight className="h-3.5 w-3.5" /></>
                                                        ) : (
                                                            <>DETAILS <Eye className="h-3.5 w-3.5" /></>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => triggerDelete(req.id)}
                                                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-100 transition-all shadow-sm"
                                                        title="Delete Booking"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                         );
                                     })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, displayed.length)}</span> of <span className="text-slate-900 font-bold">{displayed.length}</span> entries
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Layer */}
            {reviewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg transform transition-transform animate-in zoom-in-95 duration-200 shadow-2xl">
                        <ReviewModal
                            booking={reviewing}
                            onDecision={handleDecision}
                            onClose={() => setReviewing(null)}
                            isLoading={processing}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <AlertTriangle className="w-8 h-8 text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Booking?</h3>
                            <p className="text-slate-500 font-medium text-sm mb-8">
                                This action cannot be undone. Are you sure you want to permanently delete this booking record?
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    disabled={processing}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    {processing ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
