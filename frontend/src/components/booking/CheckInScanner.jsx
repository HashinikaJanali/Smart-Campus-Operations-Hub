import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Upload, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { checkInBooking } from '../../services/bookingService';

export default function CheckInScanner({ onClose, onSuccess }) {
    const [status, setStatus] = useState('IDLE'); // IDLE, PROCESSING, SUCCESS, ERROR
    const [message, setMessage] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Do NOT set status to PROCESSING here yet, as it might unmount the reader if not careful
            // We'll keep the IDLE state but show a small loading indicator if needed, 
            // or just ensure the reader is always mounted.
            const html5QrCode = new Html5Qrcode("upload-reader");
            const result = await html5QrCode.scanFile(file, true);
            processCheckIn(result);
        } catch (error) {
            console.error("QR Scan Error:", error);
            setStatus('ERROR');
            setMessage("Failed to read QR code. Please ensure it's a valid booking QR.");
        }
    };

    const processCheckIn = async (bookingId) => {
        try {
            setStatus('PROCESSING');
            const result = await checkInBooking(bookingId);
            setStatus('SUCCESS');
            setMessage(`Successfully checked in for ${result.resourceName}!`);
            if (onSuccess) onSuccess(result);
        } catch (error) {
            setStatus('ERROR');
            setMessage(error.response?.data || "Check-in failed. This booking might not exist or is not approved.");
        }
    };

    // Removal of startCamera method

    return (
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden">
            {/* Hidden reader for file upload processing - MUST STAY MOUNTED */}
            <div id="upload-reader" style={{ display: 'none' }}></div>

            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="text-center relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Self <span className="text-indigo-600">Check-in</span></h3>
                <p className="text-slate-500 text-sm font-medium mb-8">Upload your booking QR code to verify your arrival.</p>

                {(status === 'IDLE' || status === 'PROCESSING') && (
                    <div className="space-y-4">
                        {status === 'IDLE' ? (
                             <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-300 rounded-3xl bg-slate-50 hover:bg-white hover:border-indigo-400 active:border-indigo-900 active:bg-indigo-50/50 transition-all cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <p className="font-bold text-slate-700">Click to Upload QR Image</p>
                                <p className="text-xs text-slate-400 mt-2">Supports PNG, JPG, WEBP</p>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center border-2 border-dashed border-indigo-300 rounded-3xl bg-slate-50">
                                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                                <p className="font-bold text-slate-700">Verifying QR...</p>
                            </div>
                        )}
                    </div>
                )}

                {status === 'PROCESSING' && (
                    <div className="py-20 flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                        <p className="font-bold text-slate-700">Verifying Booking...</p>
                    </div>
                )}

                {status === 'SUCCESS' && (
                    <div className="py-10 text-center">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/10">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Check-in Verified!</h4>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <button 
                            onClick={onClose}
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}

                {status === 'ERROR' && (
                    <div className="py-10 text-center">
                        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-600/10">
                            <AlertTriangle className="w-12 h-12" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Verification Failed</h4>
                        <p className="text-slate-500 mb-8">{message}</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStatus('IDLE')}
                                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-slate-300 transition-all"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
