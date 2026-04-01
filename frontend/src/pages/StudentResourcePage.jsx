import React, { useState, useEffect } from 'react';
import { getAllResources } from '../services/resourceService';
import { createBooking } from '../services/bookingService';
import UserHeader from '../components/common/UserHeader';
import BookingForm from '../components/booking/BookingForm';
import {
    Building2, FlaskConical, Users, MonitorPlay, Archive,
    GraduationCap, Search, RefreshCw, CheckCircle2,
    FolderOpen, MapPin, Users as UsersIcon, Clock,
    X, Check, Loader2, Sunrise, Sunset, FileText, AlertCircle
} from 'lucide-react';

const TC = {
    LECTURE_HALL: { icon: Building2, textClass: 'text-slate-900', bgClass: 'bg-slate-100', borderClass: 'border-slate-300', label: 'Lecture Hall' },
    LAB: { icon: FlaskConical, textClass: 'text-cyan-700', bgClass: 'bg-cyan-100', borderClass: 'border-cyan-300', label: 'Lab' },
    MEETING_ROOM: { icon: Users, textClass: 'text-teal-700', bgClass: 'bg-teal-100', borderClass: 'border-teal-300', label: 'Meeting Room' },
    EQUIPMENT: { icon: MonitorPlay, textClass: 'text-indigo-700', bgClass: 'bg-indigo-100', borderClass: 'border-indigo-300', label: 'Equipment' },
};
const cfg = t => TC[t] || { icon: Archive, textClass: 'text-slate-600', bgClass: 'bg-slate-200', borderClass: 'border-slate-300', label: t };

export default function StudentResourcePage() {
    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState('ALL');
    const [selected, setSelected] = useState(null);

    // Booking form state
    const [isBooking, setIsBooking] = useState(false);
    const [bookingResource, setBookingResource] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { load(); }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    const load = async () => {
        try {
            setLoading(true); setError('');
            const d = await getAllResources();
            const active = d.filter(r => r.status === 'ACTIVE');
            setResources(active); setFiltered(active);
        } catch (e) {
            setError('Could not connect to backend on port 8090.');
        } finally { setLoading(false); }
    };

    const applyFilter = (type, s) => {
        let f = resources;
        if (type !== 'ALL') f = f.filter(r => r.type === type);
        if (s) f = f.filter(r =>
            r.name.toLowerCase().includes(s.toLowerCase()) ||
            r.location.toLowerCase().includes(s.toLowerCase())
        );
        setFiltered(f);
    };

    const handleType = t => { setTypeF(t); applyFilter(t, search); };
    const handleSearch = e => { setSearch(e.target.value); applyFilter(typeF, e.target.value); };

    // Booking Handlers
    const handleBookNow = (e, resource) => {
        e.stopPropagation();
        setBookingResource(resource);
        setIsBooking(true);
    };

    const handleBookingSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            const userId = localStorage.getItem('userId') || 'STU001'; // Fallback for demo
            const bookingData = { ...formData, userId };
            await createBooking(bookingData);
            alert('Booking request sent successfully! You can track its status in the Bookings page.');
            setIsBooking(false);
            setBookingResource(null);
        } catch (error) {
            alert(error.response?.data || "Failed to submit booking request. Please check availability.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <UserHeader />
            {/* ── HERO ── */}
            <div className="relative overflow-hidden border-b border-[#241571] bg-gradient-to-br from-[#1c105c] via-[#241571] to-[#2e1a8a] px-10 py-14">
                {/* Decorative shapes */}
                <div className="absolute -top-16 right-[10%] h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 right-[5%] h-56 w-56 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
                <div className="absolute top-[30%] right-[45%] h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-10">
                    <div className="flex-1">
                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-bold tracking-wide text-indigo-200 shadow-sm backdrop-blur-md border border-white/5">
                            <GraduationCap className="h-4 w-4" /> Student Portal
                        </div>
                        <h1 className="mb-3 text-5xl font-black leading-tight text-white tracking-tight">
                            Find the perfect<br />
                            <span className="bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent underline decoration-indigo-500/20 underline-offset-8">campus space</span>
                        </h1>
                        <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-indigo-100/70">
                            Discover and reserve available lecture halls, labs, and equipment instantly across our campus.
                        </p>
                        <div className="flex max-w-lg items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-inner backdrop-blur-md focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-400/20 hover:bg-white/10 transition-all">
                            <Search className="ml-2 h-5 w-5 text-indigo-300" />
                            <input className="flex-1 bg-transparent text-sm text-white placeholder-indigo-300 outline-none"
                                placeholder="Search rooms, labs, equipment..."
                                value={search} onChange={handleSearch} />
                            <button className="flex items-center justify-center rounded-xl bg-indigo-600 p-2 text-white shadow-md transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
                                onClick={load} title="Refresh">
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Hero stats */}
                    <div className="grid shrink-0 grid-cols-2 gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
                        {[
                            { lbl: 'Available', v: resources.length, ico: CheckCircle2, textClass: 'text-emerald-400' },
                            { lbl: 'Halls', v: resources.filter(r => r.type === 'LECTURE_HALL').length, ico: Building2, textClass: 'text-indigo-300' },
                            { lbl: 'Labs', v: resources.filter(r => r.type === 'LAB').length, ico: FlaskConical, textClass: 'text-blue-300' },
                            { lbl: 'Rooms', v: resources.filter(r => r.type === 'MEETING_ROOM').length, ico: Users, textClass: 'text-indigo-200' },
                        ].map((st, i) => {
                            const Icon = st.ico;
                            return (
                                <div key={i} className="flex min-w-[110px] flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/5 p-5 shadow-lg backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1">
                                    <Icon className={`h-8 w-8 ${st.textClass}`} />
                                    <span className="text-3xl font-black text-white">{st.v}</span>
                                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{st.lbl}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-10 py-10 pb-20">
                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
                        <span className="flex items-center gap-2 font-medium">
                            <AlertCircle className="h-5 w-5" /> {error}
                        </span>
                        <button className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-50" onClick={load}>Retry</button>
                    </div>
                )}

                {/* Type Pills */}
                <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {[
                        { t: 'ALL', ico: FolderOpen, lbl: 'All Resources' },
                        { t: 'LECTURE_HALL', ico: Building2, lbl: 'Lecture Halls' },
                        { t: 'LAB', ico: FlaskConical, lbl: 'Labs' },
                        { t: 'MEETING_ROOM', ico: Users, lbl: 'Meeting Rooms' },
                        { t: 'EQUIPMENT', ico: MonitorPlay, lbl: 'Equipment' },
                    ].map(({ t, ico, lbl }) => {
                        const Icon = ico;
                        return (
                            <button key={t} onClick={() => handleType(t)}
                                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all shadow-sm ${typeF === t
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-indigo-500/30'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900'
                                    }`}>
                                <Icon className="h-4 w-4" /> {lbl}
                                {t !== 'ALL' && (
                                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeF === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {resources.filter(r => r.type === t).length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Results info */}
                <div className="mb-6 text-sm text-slate-500">
                    Showing <strong className="text-slate-900">{filtered.length}</strong> available resources
                    {typeF !== 'ALL' && <span> · {cfg(typeF).label}</span>}
                    {search && <span> · "{search}"</span>}
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <div className="mt-4 text-sm font-medium text-slate-500">Loading available resources...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-20 shadow-sm">
                        <Search className="mb-4 h-12 w-12 text-slate-300" />
                        <div className="text-xl font-bold text-slate-900">No resources found</div>
                        <div className="mt-2 text-sm text-slate-500">Try a different filter</div>
                        <button className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700"
                            onClick={() => { setSearch(''); setTypeF('ALL'); setFiltered(resources); }}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((r, i) => {
                            const c = cfg(r.type);
                            const Icon = c.icon;
                            return (
                                <div key={r.id} onClick={() => setSelected(r)}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 animate-in fade-in zoom-in-95"
                                    style={{ animationDelay: `${i * .05}s` }}>

                                    {/* Indigo accent top */}
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />

                                    <div className="mb-4 flex items-start justify-between">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${c.bgClass} ${c.textClass} ${c.borderClass}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">ACTIVE</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 text-lg font-bold text-slate-900">{r.name}</div>

                                    <div className="mb-4 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4 text-slate-400" />{r.location}
                                        </div>
                                        {r.capacity > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <UsersIcon className="h-4 w-4 text-slate-400" />Capacity {r.capacity}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock className="h-4 w-4 text-slate-400" />{r.availableFrom} – {r.availableTo}
                                        </div>
                                    </div>

                                    {r.description && (
                                        <div className="mb-4 border-l-2 border-indigo-100 pl-3 text-xs italic text-slate-400 line-clamp-2 min-h-[32px]">
                                            {r.description}
                                        </div>
                                    )}

                                    <div className="mt-2 flex items-center justify-between pt-4 border-t border-slate-50">
                                        <button 
                                            onClick={(e) => handleBookNow(e, r)}
                                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30"
                                        >
                                            Book Now
                                        </button>
                                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:underline">
                                            Details <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ── */}
            {selected && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all" onClick={() => setSelected(null)}>
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-400`} />

                        <div className="mb-6 flex items-start gap-5">
                            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${cfg(selected.type).bgClass} ${cfg(selected.type).textClass} ${cfg(selected.type).borderClass}`}>
                                {React.createElement(cfg(selected.type).icon, { className: "h-8 w-8" })}
                            </div>
                            <div className="flex-1 pt-1">
                                <h2 className="mb-2 text-2xl font-extrabold text-slate-900 leading-none">{selected.name}</h2>
                                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${cfg(selected.type).bgClass} ${cfg(selected.type).textClass} ${cfg(selected.type).borderClass}`}>
                                    {cfg(selected.type).label}
                                </span>
                            </div>
                            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors" onClick={() => setSelected(null)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-6 h-px w-full bg-slate-100" />

                        <div className="mb-8 grid grid-cols-2 gap-3">
                            {[
                                { lbl: 'Location', v: selected.location, ico: MapPin },
                                { lbl: 'Capacity', v: selected.capacity || 'N/A', ico: UsersIcon },
                                { lbl: 'Opens at', v: selected.availableFrom, ico: Sunrise },
                                { lbl: 'Closes at', v: selected.availableTo, ico: Sunset },
                                { lbl: 'Status', v: 'ACTIVE', ico: CheckCircle2, active: true },
                                { lbl: 'Description', v: selected.description || 'N/A', ico: FileText },
                            ].map(({ lbl, v, ico, active }) => {
                                const DetailIcon = ico;
                                return (
                                    <div key={lbl} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
                                        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <DetailIcon className="h-3 w-3" /> {lbl}
                                        </div>
                                        <div className={`text-sm font-bold ${active ? 'text-emerald-600' : 'text-slate-900'} ${lbl === 'Description' ? 'line-clamp-2' : ''}`}>{v}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
                            <div className="flex-1 flex items-center gap-2 text-sm font-bold text-emerald-600">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <Check className="h-4 w-4" />
                                </span>
                                Available for Booking
                            </div>
                            <button 
                                onClick={(e) => { setSelected(null); handleBookNow(e, selected); }}
                                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── BOOKING MODAL ── */}
            {isBooking && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-xl scale-in-center overflow-hidden">
                        <BookingForm 
                            initialResourceId={bookingResource?.id}
                            onClose={() => { setIsBooking(false); setBookingResource(null); }}
                            onSubmit={handleBookingSubmit}
                            isLoading={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper for detail modal
const ArrowRight = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;