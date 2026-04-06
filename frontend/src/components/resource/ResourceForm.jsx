import React, { useState, useEffect } from 'react';
import { addResource, updateResource } from '../../services/resourceService';
import { 
    Building2, FlaskConical, Users, MonitorPlay, 
    X, AlertCircle, Save, CheckCircle2, Edit,
    MapPin, Users2, Clock, CheckCircle, Wrench, FileText, Plus
} from 'lucide-react';

export default function ResourceForm({ existingResource, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name:'', type:'LECTURE_HALL', location:'',
        capacity:'', status:'ACTIVE',
        availableFrom:'08:00', availableTo:'18:00', description:''
    });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    useEffect(() => {
        if (existingResource) setFormData(existingResource);
    }, [existingResource]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!formData.name || !formData.location) {
            setError('Name and Location are required!');
            return;
        }
        try {
            setLoading(true); setError('');
            const data = { ...formData, capacity: parseInt(formData.capacity) || 0 };
            if (existingResource) {
                await updateResource(existingResource.id, data);
            } else {
                await addResource(data);
            }
            onSave();
        } catch(e) {
            console.error(e);
            setError('Something went wrong. Check if backend is running!');
        } finally { setLoading(false); }
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-white p-8 font-sans shadow-2xl">
            {/* Blue accent top */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />

            {/* Header */}
            <div className="mb-6 mt-2 flex items-start justify-between">
                <div>
                    <h2 className="m-0 flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                        {existingResource ? <><Edit className="h-6 w-6 text-blue-600"/> Edit Resource</> : <><Plus className="h-6 w-6 text-blue-600"/> Add New Resource</>}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {existingResource
                            ? 'Update the resource details below'
                            : 'Fill in the details to add a new resource'}
                    </p>
                </div>
                <button className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" 
                        onClick={onClose}>
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="mb-6 h-px w-full bg-slate-100" />

            {/* Error */}
            {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Fields */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">Resource Name *</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                        name="name" value={formData.name} onChange={handleChange}
                        placeholder="e.g. Lecture Hall A" />
                </div>
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">Type</label>
                    <div className="relative">
                        <select className="w-full appearance-none cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                            name="type" value={formData.type} onChange={handleChange}>
                            <option value="LECTURE_HALL">Lecture Hall</option>
                            <option value="LAB">Lab</option>
                            <option value="MEETING_ROOM">Meeting Room</option>
                            <option value="EQUIPMENT">Equipment</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            {formData.type === 'LECTURE_HALL' && <Building2 className="h-4 w-4" />}
                            {formData.type === 'LAB' && <FlaskConical className="h-4 w-4" />}
                            {formData.type === 'MEETING_ROOM' && <Users className="h-4 w-4" />}
                            {formData.type === 'EQUIPMENT' && <MonitorPlay className="h-4 w-4" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 flex items-center gap-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500"><MapPin className="h-3 w-3"/> Location *</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                        name="location" value={formData.location} onChange={handleChange}
                        placeholder="e.g. Block A, Floor 1" />
                </div>
                <div>
                    <label className="mb-1.5 flex items-center gap-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500"><Users2 className="h-3 w-3"/> Capacity</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                        name="capacity" type="number" value={formData.capacity} onChange={handleChange}
                        placeholder="e.g. 120" />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 flex items-center gap-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <Clock className="h-3 w-3"/> 
                        {formData.status === 'OUT_OF_SERVICE' ? 'Unavailable' : 'Available From'}
                    </label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                        name="availableFrom" type="time" 
                        value={formData.status === 'OUT_OF_SERVICE' ? '' : formData.availableFrom} 
                        onChange={handleChange}
                        disabled={formData.status === 'OUT_OF_SERVICE'} />
                </div>
                <div>
                    <label className="mb-1.5 flex items-center gap-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <Clock className="h-3 w-3"/> 
                        {formData.status === 'OUT_OF_SERVICE' ? 'Unavailable' : 'Available To'}
                    </label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                        name="availableTo" type="time" 
                        value={formData.status === 'OUT_OF_SERVICE' ? '' : formData.availableTo} 
                        onChange={handleChange}
                        disabled={formData.status === 'OUT_OF_SERVICE'} />
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</label>
                    <div className="relative">
                        <select className="w-full appearance-none cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                            name="status" value={formData.status} onChange={handleChange}>
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            {formData.status === 'ACTIVE' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Wrench className="h-4 w-4 text-rose-500" />}
                        </div>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 flex items-center gap-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500"><FileText className="h-3 w-3"/> Description</label>
                    <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" 
                        name="description" value={formData.description} onChange={handleChange}
                        placeholder="e.g. Has projector and AC" />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" 
                        onClick={onClose}>
                    Cancel
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:hover:translate-y-0" 
                        onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Saving...</>
                    ) : existingResource ? (
                        <><Save className="h-4 w-4" /> Update Resource</>
                    ) : (
                        <><CheckCircle2 className="h-4 w-4" /> Add Resource</>
                    )}
                </button>
            </div>
        </div>
    );
}