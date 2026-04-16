import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit3, Users, Loader2, X } from 'lucide-react';
import { getAllResources } from '../../services/resourceService';

export default function BookingForm({ onSubmit, onClose, isLoading, initialResourceId }) {
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        resourceId: initialResourceId || '',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1
    });

    useEffect(() => {
        if (initialResourceId) {
            setFormData(prev => ({ ...prev, resourceId: initialResourceId }));
        }
    }, [initialResourceId]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await getAllResources();
                // Only allow booking active resources
                setResources(data.filter(r => r.status === 'ACTIVE'));
            } catch (error) {
                console.error("Failed to fetch resources", error);
            }
        };
        fetchResources();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-3xl w-full text-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-200">
            {/* Header with Light/Indigo Aesthetic */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-indigo-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-indigo-900">
                            New Booking
                        </h2>
                        <p className="text-indigo-600/80 mt-1 text-xs font-medium">Secure a facility or equipment instantly.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-2 bg-white rounded-full hover:bg-slate-100 border border-slate-200 shadow-sm"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Resource Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        Resource required
                    </label>
                    <div className="relative">
                        <select 
                            required
                            name="resourceId"
                            value={formData.resourceId}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="" disabled>Select a facility or equipment</option>
                            {resources.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.name} ({r.type.replace('_', ' ')}) {r.capacity > 0 ? `- Capacity: ${r.capacity}` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" /> Date
                        </label>
                        <input 
                            required type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                        />
                    </div>
                     {/* Attendees */}
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" /> Attendees
                        </label>
                        <input 
                            required type="number" min="1" name="attendees" value={formData.attendees} onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                            placeholder="Expected numbers"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Start Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" /> Start time
                        </label>
                        <input 
                            required type="time" name="startTime" value={formData.startTime} onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                        />
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" /> End time
                        </label>
                        <input 
                            required type="time" name="endTime" value={formData.endTime} onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-indigo-600" /> Purpose
                    </label>
                    <textarea 
                        required name="purpose" value={formData.purpose} onChange={handleChange} rows="3"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-sm placeholder-slate-400"
                        placeholder="State the objective of this booking..."
                    />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isLoading ? 'Confirming...' : 'Request Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
}
