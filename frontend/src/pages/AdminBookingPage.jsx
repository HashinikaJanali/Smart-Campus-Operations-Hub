import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, MapPin, CalendarDays, Eye, Loader2, ArrowRight } from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import ReviewModal from '../components/booking/ReviewModal';

export default function AdminBookingPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('PENDING');

    useEffect(() => { loadAllBookings(); }, []);

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
        } catch (error) {
            alert(error.response?.data || "Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    
    // Grouping
    const displayed = bookings.filter(b => b.status === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-8 items-center">
            
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">
                            Command Center
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium tracking-wide">
                            Facilities {"&"} Equipment Authority Review
                        </p>
                    </div>

                    <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                        {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'text-indigo-700 bg-indigo-50 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'}`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {tab}
                                    {tab === 'PENDING' && pendingCount > 0 && (
                                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {pendingCount}
                                        </span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            <p className="mt-4 text-slate-500 font-medium tracking-widest text-sm uppercase">Synchronizing</p>
                        </div>
                    ) : displayed.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                                <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">Queue Configured</h3>
                                <p className="text-slate-500 text-sm mt-2">No requests currently marked as {activeTab.toLowerCase()}.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {displayed.map(req => (
                                <div key={req.id} className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{req.resourceName || `Resource #${req.resourceId}`}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">ID: {req.id}</span>
                                                    <span className="text-xs text-slate-500 font-medium">Req by: <span className="text-slate-700 font-bold">{req.userId}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {req.status === 'PENDING' && (
                                            <button 
                                                onClick={() => setReviewing(req)}
                                                className="bg-indigo-600 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                                            >
                                                Review <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                        {req.status !== 'PENDING' && (
                                            <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 uppercase tracking-wide
                                                ${req.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                                                  req.status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-700' : 
                                                  'bg-slate-100 border-slate-200 text-slate-600'}`
                                            }>
                                                {req.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                                {req.status === 'REJECTED' && <XCircle className="w-4 h-4 text-rose-600" />}
                                                {req.status === 'CANCELLED' && <AlertCircle className="w-4 h-4 text-slate-500" />}
                                                {req.status}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                                <p className="font-medium text-slate-800">{req.bookingDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeframe</p>
                                                <p className="font-medium text-slate-800">{req.startTime} — {req.endTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {req.purpose && (
                                        <div className="mt-4 px-4 text-sm text-slate-600 bg-white border border-slate-100 rounded-xl p-3">
                                            <span className="font-bold text-slate-800 block mb-1">Purpose</span> 
                                            {req.purpose}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

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
        </div>
    );
}
