import React, { useState } from 'react';
import { CheckCircle2, XCircle, Info, Loader2, X } from 'lucide-react';

export default function ReviewModal({ booking, onDecision, onClose, isLoading }) {
    const [reason, setReason] = useState('');

    if (!booking) return null;

    const isPending = booking.status === 'PENDING';
    const handleApprove = () => onDecision(booking.id, 'APPROVED', reason);
    const handleReject = () => onDecision(booking.id, 'REJECTED', reason);

    return (
        <div className="bg-white rounded-3xl w-full max-w-lg text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-200 relative">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="p-8 pb-6 border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">{isPending ? 'Review Request' : 'Booking Details'}</h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Booking ID #{booking.id}</p>
                    </div>
                    {!isPending && (
                         <span className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase border
                            ${booking.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                booking.status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                    'bg-slate-100 border-slate-200 text-slate-600'}`
                        }>
                            {booking.status}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-8 space-y-6">
                
                {/* Request Details Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resource</div>
                            <div className="font-bold text-indigo-700">{booking.resourceName || `Resource ID ${booking.resourceId}`}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">User</div>
                            <div className="font-bold text-slate-700">{booking.userId}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</div>
                            <div className="font-medium text-slate-600">{booking.bookingDate}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</div>
                            <div className="font-medium text-slate-600">{booking.startTime} - {booking.endTime}</div>
                        </div>
                        <div className="col-span-2 pt-3 border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purpose</div>
                            <div className="text-sm font-medium text-slate-700">{booking.purpose}</div>
                        </div>

                        {/* Check-in Details */}
                        {booking.status === 'APPROVED' && (
                             <div className="col-span-2 pt-3 border-t border-slate-100">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Verification Status</div>
                                {booking.checkedIn ? (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Verified Check-in</p>
                                                <p className="text-[10px] font-bold text-slate-500">{new Date(booking.checkInTime).toLocaleString()}</p>
                                            </div>
                                        </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                                        <div className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Awaiting Arrival</p>
                                            <p className="text-[10px] font-bold text-slate-400 italic">User has not checked in yet.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reason Input or Display */}
                {isPending ? (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-600" /> Decision Reason
                        </label>
                        <textarea 
                            value={reason} onChange={(e) => setReason(e.target.value)} rows="3"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm placeholder-slate-400"
                            placeholder="Optional reason for approval, required for rejection..."
                        />
                    </div>
                ) : booking.adminReason && (
                    <div className="space-y-2">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admin Feedback</div>
                         <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl italic text-sm text-slate-600">
                             "{booking.adminReason}"
                         </div>
                    </div>
                )}

                {/* Actions */}
                {isPending && (
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                        >
                            Cancel
                        </button>
                        
                        <button 
                            onClick={handleReject}
                            disabled={isLoading || !reason.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:text-rose-800 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!reason.trim() ? "Reason is required to reject" : ""}
                        >
                            {isLoading ? null : <XCircle className="w-5 h-5"/>}
                            Reject
                        </button>
                        
                        <button 
                            onClick={handleApprove}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5"/>}
                            Approve
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
