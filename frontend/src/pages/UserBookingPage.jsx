import React, { useState, useEffect } from 'react';
import UserHeader from '../components/common/UserHeader';
import useRequireAuth from '../hooks/userRequireAuth';
import { CalendarDays, Clock, MapPin, Search, Plus, Loader2, CheckCircle2, XCircle, AlertCircle, Bookmark, QrCode, UserCheck, Building2, FlaskConical, Users } from 'lucide-react';
import { getBookingsByUser, createBooking, cancelBooking } from '../services/bookingService';
import BookingForm from '../components/booking/BookingForm';
import QRModal from '../components/booking/QRModal';
import CheckInScanner from '../components/booking/CheckInScanner';

export default function UserBookingPage() {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const requireAuth = useRequireAuth();

    const userId = localStorage.getItem("userId") || "User";

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadBookings(); }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await getBookingsByUser(userId);
            setBookings(Array.isArray(data) ? data : []);
            applyFilters(Array.isArray(data) ? data : [], search, statusFilter);
        } catch (error) {
            console.error("Error loading bookings", error);
            setBookings([]);
            setFiltered([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data, pSearch, pStatus) => {
        let result = data;
        if (pStatus !== 'ALL') {
            result = result.filter(b => b.status === pStatus);
        }
        if (pSearch) {
            result = result.filter(b =>
                (b.resourceName && b.resourceName.toLowerCase().includes(pSearch.toLowerCase())) ||
                (b.purpose && b.purpose.toLowerCase().includes(pSearch.toLowerCase()))
            );
        }
        setFiltered(result);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        applyFilters(bookings, val, statusFilter);
    };

    const handleFilter = (status) => {
        setStatusFilter(status);
        applyFilters(bookings, search, status);
    };

    const handleNewBooking = () => {
        requireAuth(() => setShowForm(true));  // ← redirect to login if not logged in
    };

    const handleCreateBooking = async (formData) => {
        try {
            setSubmitting(true);
            const newBooking = { ...formData, userId };
            await createBooking(newBooking);
            setShowForm(false);
            loadBookings();
            alert("Booking created successfully!");
        } catch (error) {
            alert(error.response?.data || "Failed to create booking");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await cancelBooking(id, userId);
            loadBookings();
        } catch (error) {
            alert("Failed to cancel booking");
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'PENDING': return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
            case 'APPROVED': return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            case 'REJECTED': return { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
            case 'CANCELLED': return { icon: XCircle, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
            default: return { icon: AlertCircle, color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center">
            <UserHeader />
            <main className="w-full max-w-7xl px-8 py-10 flex-1">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 italic">
                            My <span className="text-indigo-600">Bookings</span>
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Manage and track your resource booking requests.</p>
                    </div>
                    <button
                        onClick={handleNewBooking}  // ← updated
                        className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0"
                    >
                        <Plus className="w-5 h-5" /> Create New Booking
                    </button>
                </div>

                <div className="flex bg-white border border-slate-200 text-slate-800 rounded-2xl p-2 mb-8 items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 pl-4 flex-1">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by resource, purpose..."
                            value={search}
                            onChange={handleSearch}
                            className="bg-transparent border-none text-slate-800 focus:outline-none w-full py-2 placeholder-slate-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(sf => (
                            <button
                                key={sf}
                                onClick={() => handleFilter(sf)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === sf ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
                            >
                                {sf}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                        <Bookmark className="w-16 h-16 mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-700">No Bookings Found</h3>
                        <p className="mt-2 text-sm">You haven't made any bookings that match your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(booking => {
                            const sc = getStatusConfig(booking.status);
                            const StatusIcon = sc.icon;

                            // Resource Type Icon Mapping with Name Fallback
                            const getResourceIcon = (b) => {
                                const type = b.resourceType;
                                const name = (b.resourceName || '').toUpperCase();

                                if (type === 'LECTURE_HALL' || name.includes('HALL') || name.includes('LECTURE')) return Building2;
                                if (type === 'LAB' || name.includes('LAB')) return FlaskConical;
                                if (type === 'MEETING_ROOM' || name.includes('ROOM') || name.includes('MEETING')) return Users;

                                return MapPin;
                            };
                            const ResourceIcon = getResourceIcon(booking);

                            return (
                                <div key={booking.id} className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all font-sans overflow-hidden">
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                                                <ResourceIcon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 leading-tight">{booking.resourceName || `Ref #${booking.resourceId}`}</h3>
                                                <p className="text-xs text-slate-500 font-medium">ID {booking.id}</p>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${sc.bg} ${sc.color} ${sc.border}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <CalendarDays className="w-5 h-5 text-slate-400" />
                                            <span className="font-medium">{booking.bookingDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                        {booking.adminReason && (
                                            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Admin Feedback</p>
                                                <p className="text-sm italic text-slate-700">{booking.adminReason}</p>
                                            </div>
                                        )}
                                    </div>
                                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                        <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="w-full py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    )}

                                    {booking.status === 'APPROVED' && !booking.checkedIn && (
                                        <div className="mt-4 flex gap-3 relative z-10">
                                            <button
                                                onClick={() => { setSelectedBooking(booking); setShowQR(true); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                            >
                                                <QrCode className="w-4 h-4" /> QR Code
                                            </button>
                                            <button
                                                onClick={() => { setSelectedBooking(booking); setShowScanner(true); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                                            >
                                                <UserCheck className="w-4 h-4" /> Check-in
                                            </button>
                                        </div>
                                    )}

                                    {booking.checkedIn && (
                                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 relative z-10">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Checked In</p>
                                                <p className="text-xs font-bold text-slate-800">{new Date(booking.checkInTime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div >
                            );
                        })}
                    </div >
                )}
            </main >

            {showForm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg transform transition-transform animate-in zoom-in-95 duration-200">
                        <BookingForm
                            onSubmit={handleCreateBooking}
                            onClose={() => setShowForm(false)}
                            isLoading={submitting}
                        />
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {
                showQR && selectedBooking && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="transform transition-transform animate-in zoom-in-95 duration-200">
                            <QRModal
                                booking={selectedBooking}
                                onClose={() => { setShowQR(false); setSelectedBooking(null); }}
                            />
                        </div>
                    </div>
                )
            }

            {/* Scanner Modal */}
            {
                showScanner && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <div className="transform transition-transform animate-in zoom-in-95 duration-200 w-full max-w-lg">
                            <CheckInScanner
                                onClose={() => { setShowScanner(false); setSelectedBooking(null); }}
                                onSuccess={() => {
                                    setShowScanner(false);
                                    setSelectedBooking(null);
                                    loadBookings();
                                }}
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
}