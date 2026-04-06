import React, { useState, useEffect } from 'react';
import {
    Building2, FlaskConical, Users, MonitorPlay,
    Plus, Search, RefreshCcw, LayoutDashboard,
    Globe, Info, MapPin, Trash2, Edit, Loader2,
    Database, SlidersHorizontal, Filter, X,
    CalendarDays, Clock, CheckCircle2, Wrench
} from 'lucide-react';
import { getAllResources, deleteResource } from '../services/resourceService';
import ResourceForm from '../components/resource/ResourceForm';
import AdminSidebar from '../components/common/AdminSidebar';

const TC = {
    LECTURE_HALL: { icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', label: 'Lecture Hall' },
    LAB:          { icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Lab' },
    MEETING_ROOM: { icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Meeting Room' },
    EQUIPMENT:    { icon: MonitorPlay, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Equipment' },
};
const cfg = (t) => TC[t] || { icon: Database, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', label: t };

export default function AdminResourcePage() {
    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editRes, setEditRes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Filter States
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState('ALL');
    const [statusF, setStatusF] = useState('ALL');
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            setLoading(true);
            const d = await getAllResources();
            setResources(d);
            applyFilters(d, search, typeF, statusF);
        } catch (e) {
            console.error("Failed to load resources", e);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data, s, t, st) => {
        let f = data || resources;
        if (t !== 'ALL') f = f.filter(r => r.type === t);
        if (st !== 'ALL') f = f.filter(r => r.status === st);
        if (s) {
            const lowS = s.toLowerCase();
            f = f.filter(r =>
                (r.name || '').toLowerCase().includes(lowS) ||
                (r.location || '').toLowerCase().includes(lowS) ||
                (r.id || '').toLowerCase().includes(lowS)
            );
        }
        setFiltered(f);
    };

    const handleSearch = (val) => {
        setSearch(val);
        applyFilters(null, val, typeF, statusF);
    };

    const doFilter = (t, st) => {
        setTypeF(t); setStatusF(st);
        applyFilters(null, search, t, st);
    };

    const handleSidebarFilter = (type, status) => {
        setActiveFilter(status !== 'ALL' ? status : type !== 'ALL' ? type : 'ALL');
        doFilter(type, status);
    };

    const onDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await deleteResource(id);
            load();
        } catch (e) {
            console.error("Failed to delete resource", e);
        }
    };

    const onEdit = (r) => {
        setEditRes(r);
        setShowForm(true);
    };

    const onSave = () => {
        setShowForm(false);
        setEditRes(null);
        load();
    };

    const onClose = () => {
        setShowForm(false);
        setEditRes(null);
    };

    const activeCount = resources.filter(r => r.status === 'ACTIVE').length;
    const oosCount    = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
                activePage="resources"
                onFilterChange={handleSidebarFilter}
                activeFilter={activeFilter}
            />

            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>
                
                {/* ── HEADER SECTION ── */}
                <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                            <LayoutDashboard className="w-3.5 h-3.5" /> Operations Hub
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            Facilities <span className="text-indigo-600">& Assets</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric',
                                month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                style={{ background: 'white' }}
                                type="text"
                                placeholder="Search resources..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 shadow-sm transition-all"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => { setEditRes(null); setShowForm(true); }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" /> Add Resource
                        </button>
                    </div>
                </div>

                {/* ── STATS GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Resources', count: resources.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Active', count: activeCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Out of Service', count: oosCount, icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                        { label: 'Labs Available', count: resources.filter(r => r.type === 'LAB').length, icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                    ].map((s, idx) => (
                        <div key={idx} className={`bg-white border ${s.border} rounded-2xl p-5 shadow-sm shadow-indigo-500/5 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <span className={`text-3xl font-extrabold ${s.color}`}>{s.count}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── FILTERS BAR ── */}
                <div className="bg-white rounded-xl border border-indigo-100 p-4 mb-6 shadow-sm shadow-indigo-500/5">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-tight text-slate-400">Filters:</span>
                        </div>

                        <select
                            className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white appearance-none cursor-pointer transition-all"
                            value={typeF}
                            onChange={(e) => doFilter(e.target.value, statusF)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                            <option value="LAB">🔬 Lab</option>
                            <option value="MEETING_ROOM">🤝 Meeting Room</option>
                            <option value="EQUIPMENT">📽️ Equipment</option>
                        </select>

                        <select
                            className="pl-4 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white appearance-none cursor-pointer transition-all"
                            value={statusF}
                            onChange={(e) => doFilter(typeF, e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">✅ Active</option>
                            <option value="OUT_OF_SERVICE">🔧 Out of Service</option>
                        </select>

                        <button 
                            onClick={() => { doFilter('ALL', 'ALL'); setSearch(''); setActiveFilter('ALL'); }}
                            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                        >
                            <RefreshCcw className="h-3 w-3" /> Reset
                        </button>

                        <div className="ml-auto">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{filtered.length} results</span>
                        </div>
                    </div>
                </div>

                {/* ── RESOURCES TABLE ── */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-indigo-100 bg-slate-50 px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-tight text-sm">
                             <Database className="h-5 w-5 text-indigo-600" /> Resource Catalogue
                        </div>
                        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-black text-indigo-700">{filtered.length} assets</span>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                <p className="mt-4 text-sm font-medium text-slate-500">Loading resources...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                    <Search className="h-12 w-12 text-slate-300" />
                                </div>
                                <div className="text-xl font-black text-slate-900">No resources found</div>
                                <p className="mt-2 text-sm text-slate-500 font-medium">Try broadening your search or filters.</p>
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-indigo-50/30 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        <th className="px-6 py-3">Resource</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Capacity</th>
                                        <th className="px-6 py-3">Availability</th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((r) => {
                                        const c = cfg(r.type);
                                        const Icon = c.icon;
                                        return (
                                            <tr key={r.id} className="group transition-colors hover:bg-slate-50/80">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.color} border ${c.border} shadow-sm group-hover:scale-105 transition-transform`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="text-sm font-bold text-slate-900 truncate tracking-tight">{r.name}</div>
                                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">ID #{r.id?.slice(-8) || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${c.bg} ${c.color} ${c.border}`}>
                                                        {c.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {r.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                        {r.capacity > 0 ? `👥 ${r.capacity}` : '—'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                        <Clock className="h-3.5 w-3.5 text-slate-300" /> {r.availableFrom}–{r.availableTo}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                        ${r.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`
                                                    }>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
                                                        {r.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => onEdit(r)}
                                                            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 transition-all shadow-sm"
                                                            title="Edit Resource"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => onDelete(r.id)}
                                                            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-100 transition-all shadow-sm"
                                                            title="Delete Resource"
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
                </div>
            </main>

            {/* ── MODALS ── */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-xl transform transition-transform animate-in zoom-in-95 duration-200 shadow-2xl overflow-hidden rounded-3xl">
                        <ResourceForm
                            existingResource={editRes}
                            onSave={onSave}
                            onClose={onClose}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}