import React, { useState, useEffect } from 'react';
import { getAllResources, deleteResource } from '../services/resourceService';
import ResourceForm from '../components/resource/ResourceForm';
import AdminSidebar from '../components/common/AdminSidebar';
import {
    Building2, FlaskConical, Users, MonitorPlay,
    Archive, LayoutDashboard, FolderOpen, Plus,
    CheckCircle2, Wrench, Search, ClipboardList,
    MapPin, Clock, Edit, Trash2, Loader2, RefreshCcw, Menu
} from 'lucide-react';

const TC = {
    LECTURE_HALL: { icon: Building2, textClass: 'text-slate-900', bgClass: 'bg-slate-100', label: 'Lecture Hall' },
    LAB: { icon: FlaskConical, textClass: 'text-cyan-700', bgClass: 'bg-cyan-100', label: 'Lab' },
    MEETING_ROOM: { icon: Users, textClass: 'text-teal-700', bgClass: 'bg-teal-100', label: 'Meeting Room' },
    EQUIPMENT: { icon: MonitorPlay, textClass: 'text-indigo-700', bgClass: 'bg-indigo-100', label: 'Equipment' },
};
const cfg = t => TC[t] || { icon: Archive, textClass: 'text-slate-600', bgClass: 'bg-slate-200', label: t };


export default function AdminResourcePage() {
    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editRes, setEditRes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState('ALL');
    const [statusF, setStatusF] = useState('ALL');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => { load(); }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

    const load = async () => {
        try {
            setLoading(true);
            const d = await getAllResources();
            setResources(d);
            flt(d, '', 'ALL', 'ALL');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const flt = (data, s, t, st) => {
        let f = data ?? resources;
        if (t !== 'ALL') f = f.filter(r => r.type === t);
        if (st !== 'ALL') f = f.filter(r => r.status === st);
        if (s) f = f.filter(r =>
            r.name.toLowerCase().includes(s.toLowerCase()) ||
            r.location.toLowerCase().includes(s.toLowerCase())
        );
        setFiltered(f);
    };

    const onDelete = async id => {
        if (!window.confirm('Delete this resource?')) return;
        try { await deleteResource(id); load(); } catch (e) { console.error(e); }
    };

    const onEdit = r => { setEditRes(r); setShowForm(true); };
    const onSave = () => { setShowForm(false); setEditRes(null); load(); };
    const onClose = () => { setShowForm(false); setEditRes(null); };

    const doFilter = (t, st) => { setTypeF(t); setStatusF(st); flt(null, search, t, st); };
    const doSearch = s => { setSearch(s); flt(null, s, typeF, statusF); };

    const active = resources.filter(r => r.status === 'ACTIVE').length;
    const oos = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* ── SHARED ADMIN SIDEBAR ── */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
                activePage="resources"
            />


            {/* ── MAIN ── */}
            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>
                {/* Topbar */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="mb-1 text-sm font-medium text-slate-500">Welcome back, Admin 👋</div>
                        <h1 className="text-3xl font-extrabold leading-tight text-slate-900">
                            Facilities <span className="text-blue-600">{"&"} Assets</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input className="w-48 bg-transparent text-sm text-slate-900 outline-none"
                                placeholder="Search resources..."
                                value={search} onChange={e => doSearch(e.target.value)} />
                        </div>
                        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/40"
                            onClick={() => { setEditRes(null); setShowForm(true); }}>
                            <Plus className="h-4 w-4" /> Add Resource
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {[
                        { lbl: 'Total Resources', v: resources.length, ico: FolderOpen, borderClass: 'border-blue-500', textClass: 'text-blue-600', bgClass: 'bg-blue-50' },
                        { lbl: 'Active', v: active, ico: CheckCircle2, borderClass: 'border-emerald-500', textClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
                        { lbl: 'Out of Service', v: oos, ico: Wrench, borderClass: 'border-rose-500', textClass: 'text-rose-600', bgClass: 'bg-rose-50' },
                        { lbl: 'Labs Available', v: resources.filter(r => r.type === 'LAB').length, ico: FlaskConical, borderClass: 'border-cyan-500', textClass: 'text-cyan-600', bgClass: 'bg-cyan-50' },
                    ].map((st, i) => {
                        const Icon = st.ico;
                        return (
                            <div key={i} className={`rounded-2xl border border-slate-200 border-b-4 ${st.borderClass} bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className={`rounded-lg p-2 ${st.bgClass} ${st.textClass}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className={`text-3xl font-extrabold ${st.textClass}`}>{st.v}</span>
                                </div>
                                <div className="text-sm font-medium text-slate-500">{st.lbl}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Filter bar */}
                <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <LayoutDashboard className="h-4 w-4" /> Filters:
                    </span>
                    <select className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={typeF} onChange={e => doFilter(e.target.value, statusF)}>
                        <option value="ALL">All Types</option>
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Lab</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                    <select className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={statusF} onChange={e => doFilter(typeF, e.target.value)}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                    <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                        onClick={() => { doFilter('ALL', 'ALL'); setSearch(''); }}>
                        <RefreshCcw className="h-3 w-3" /> Reset
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 border border-slate-200">{filtered.length} results</span>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <div className="mt-4 text-sm font-medium text-slate-500">Loading resources...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-sm">
                        <Search className="mb-4 h-12 w-12 text-slate-300" />
                        <div className="text-lg font-bold text-slate-900">No resources found</div>
                        <div className="mt-1 text-sm text-slate-500">Try adjusting your filters</div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <span className="flex items-center gap-2 font-bold text-slate-900">
                                <ClipboardList className="h-5 w-5 text-blue-600" /> Resource Catalogue
                            </span>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{filtered.length} items</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-3">Resource</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Capacity</th>
                                        <th className="px-6 py-3">Availability</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r, i) => {
                                        const c = cfg(r.type);
                                        const Icon = c.icon;
                                        return (
                                            <tr key={r.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bgClass} ${c.textClass}`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{r.name}</div>
                                                            <div className="text-xs text-slate-400">ID #{r.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.bgClass} ${c.textClass}`}>
                                                        <Icon className="h-3.5 w-3.5" /> {c.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {r.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {r.capacity > 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="h-3.5 w-3.5 text-slate-400" /> {r.capacity}
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                        {r.availableFrom}–{r.availableTo}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${r.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                        {r.status === 'ACTIVE' ? 'ACTIVE' : 'OUT OF SERVICE'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex gap-2">
                                                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm"
                                                            onClick={() => onEdit(r)}>
                                                            <Edit className="h-3.5 w-3.5" /> Edit
                                                        </button>
                                                        <button className="flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition-all hover:bg-rose-100 hover:shadow-sm"
                                                            onClick={() => onDelete(r.id)}
                                                            title="Delete">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* ── FORM MODAL ── */}
            {showForm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
                    <div className="animate-in zoom-in-95 max-h-[92vh] w-[580px] overflow-y-auto rounded-2xl shadow-2xl duration-200">
                        <ResourceForm existingResource={editRes} onSave={onSave} onClose={onClose} />
                    </div>
                </div>
            )}
        </div>
    );
}