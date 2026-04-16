import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, ShieldCheck } from 'lucide-react';

export default function QRModal({ booking, onClose }) {
  const downloadQR = () => {
    const svg = document.getElementById('booking-qr');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 100;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR
      ctx.drawImage(img, 20, 20);
      
      // Draw Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Booking ID: ${booking.id}`, canvas.width / 2, img.height + 50);
      ctx.font = '14px sans-serif';
      ctx.fillText(booking.resourceName, canvas.width / 2, img.height + 75);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Booking_${booking.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-xl shadow-indigo-600/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Access <span className="text-indigo-600">Pass</span></h3>
        <p className="text-slate-500 text-sm font-medium mb-8">Scan this QR code at the resource entry to complete your check-in.</p>

        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-indigo-300 inline-block mb-8 group hover:border-indigo-300 transition-colors">
          <QRCodeSVG 
            id="booking-qr"
            value={booking.id} 
            size={200}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <Download className="w-5 h-5" /> Download QR Code
          </button>
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking Details</p>
            <p className="text-sm font-bold text-slate-700 truncate">{booking.resourceName}</p>
            <p className="text-xs text-slate-500">{booking.bookingDate} | {booking.startTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
