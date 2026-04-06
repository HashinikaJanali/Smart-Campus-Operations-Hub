import React, { useState, useEffect } from 'react';
import { getAllResources, deleteResource } from '../services/resourceService';
import ResourceForm from '../components/resource/ResourceForm';

import Sidebar from '../components/common/sidebar';

const injectStyles = () => {
    if (document.getElementById('crex-admin')) return;
    const s = document.createElement('style');
    s.id = 'crex-admin';
    s.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimY   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }

        body { background:#f5f3ee !important; }
        .ca  { font-family:'DM Sans',sans-serif !important; }

        .sa { animation:fadeUp .5s ease forwards; opacity:0; }
        .sa:nth-child(1){animation-delay:.05s}
        .sa:nth-child(2){animation-delay:.12s}
        .sa:nth-child(3){animation-delay:.19s}
        .sa:nth-child(4){animation-delay:.26s}

        .sh { transition:all .25s ease !important; }
        .sh:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.08) !important; }

        .shimY {
            background:linear-gradient(90deg,#1a1a1a,#d4a017,#e8b923,#1a1a1a);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            animation:shimY 3s linear infinite;
        }

        .tr-c:hover { background:#faf9f6 !important; }
        .btn-c { transition:all .15s ease !important; }
        .btn-c:hover { transform:scale(1.05); }
        .row-c { animation:fadeUp .4s ease forwards; opacity:0; }
        .min   { animation:modalIn .3s ease forwards; }
        .add-c:hover {
            background:#1a1a1a !important;
            transform:translateY(-2px);
            box-shadow:0 8px 20px rgba(26,26,26,.25) !important;
        }
    `;
    document.head.appendChild(s);
};


import AdminSidebar from '../components/common/AdminSidebar';
import {
    Building2, FlaskConical, Users, MonitorPlay,
    Archive, LayoutDashboard, FolderOpen, Plus,
    CheckCircle2, Wrench, Search, ClipboardList,
    MapPin, Clock, Edit, Trash2, Loader2, RefreshCcw, Menu
} from 'lucide-react';

const TC = {
    LECTURE_HALL: { icon:'🏛️', color:'#1a1a1a', bg:'#f0ede6', label:'Lecture Hall' },
    LAB:          { icon:'🔬', color:'#c47d0e', bg:'#fef3dc', label:'Lab' },
    MEETING_ROOM: { icon:'🤝', color:'#2d6a4f', bg:'#d8f3dc', label:'Meeting Room' },
    EQUIPMENT:    { icon:'📽️', color:'#5e4b8b', bg:'#ede7f6', label:'Equipment' },
};
const cfg = t => TC[t] || { icon:'📦', color:'#6b6b6b', bg:'#f0ede6', label: t };


export default function AdminResourcePage() {

    const [resources,    setResources]    = useState([]);
    const [filtered,     setFiltered]     = useState([]);
    const [showForm,     setShowForm]     = useState(false);
    const [editRes,      setEditRes]      = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [search,       setSearch]       = useState('');
    const [typeF,        setTypeF]        = useState('ALL');
    const [statusF,      setStatusF]      = useState('ALL');
    const [activeFilter, setActiveFilter] = useState('ALL');

    const [resources, setResources] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editRes, setEditRes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState('ALL');
    const [statusF, setStatusF] = useState('ALL');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => { injectStyles(); load(); }, []);

    const load = async () => {
        try {
            setLoading(true);
            const d = await getAllResources();
            setResources(d);
            flt(d, '', 'ALL', 'ALL');
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    const flt = (data, s, t, st) => {
        let f = data ?? resources;
        if (t  !== 'ALL') f = f.filter(r => r.type   === t);
        if (st !== 'ALL') f = f.filter(r => r.status === st);
        if (s)  f = f.filter(r =>
            r.name.toLowerCase().includes(s.toLowerCase()) ||
            r.location.toLowerCase().includes(s.toLowerCase())
        );
        setFiltered(f);
    };

    const onDelete = async id => {
        if (!window.confirm('Delete this resource?')) return;
        try { await deleteResource(id); load(); } catch(e) { console.error(e); }
    };

    const onEdit  = r => { setEditRes(r); setShowForm(true); };
    const onSave  = () => { setShowForm(false); setEditRes(null); load(); };
    const onClose = () => { setShowForm(false); setEditRes(null); };

    const doFilter = (t, st) => {
        setTypeF(t); setStatusF(st);
        flt(null, search, t, st);
    };


    const doSearch = s => {
        setSearch(s);
        flt(null, s, typeF, statusF);
    };

    const handleSidebarFilter = (type, status) => {
        setActiveFilter(status !== 'ALL' ? status : type !== 'ALL' ? type : 'ALL');
        doFilter(type, status);
    };

    const handleSidebarAdd = () => {
        setEditRes(null);
        setShowForm(true);
    };


    const active = resources.filter(r => r.status === 'ACTIVE').length;
    const oos    = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;

    return (

        <div className="ca" style={S.layout}>

            {/* ── SIDEBAR ── */}
            <Sidebar
                onFilterChange={handleSidebarFilter}
                onAddResource={handleSidebarAdd}
                activeFilter={activeFilter}
            />

            {/* ── MAIN ── */}
            <main style={S.main}>

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
                <div style={S.topbar}>
                    <div>
                        <div style={S.welcome}>Welcome back, Admin 👋</div>
                        <h1 style={S.title}>
                            Facilities <span className="shimY">& Assets</span>
                        </h1>
                        <p style={S.sub}>
                            {new Date().toLocaleDateString('en-US',{
                                weekday:'long', year:'numeric',
                                month:'long', day:'numeric'
                            })}
                        </p>
                    </div>
                    <div style={S.topRight}>
                        <div style={S.sw}>
                            <span style={{color:'#aaa',fontSize:'14px'}}>🔍</span>
                            <input
                                style={S.si}
                                placeholder="Search resources..."
                                value={search}
                                onChange={e => doSearch(e.target.value)}
                            />
                        </div>
                        <button
                            className="add-c"
                            style={S.addBtn}
                            onClick={() => { setEditRes(null); setShowForm(true); }}>
                            ＋ Add Resource
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={S.sg}>
                    {[
                        {lbl:'Total Resources', v:resources.length,                           ico:'🗂️', accent:'#e8b923'},
                        {lbl:'Active',          v:active,                                     ico:'✅', accent:'#2d6a4f'},
                        {lbl:'Out of Service',  v:oos,                                        ico:'🔧', accent:'#c0392b'},
                        {lbl:'Labs Available',  v:resources.filter(r=>r.type==='LAB').length, ico:'🔬', accent:'#c47d0e'},
                    ].map((st,i) => (
                        <div key={i} className="sa sh"
                            style={{...S.sc, borderBottom:`3px solid ${st.accent}`}}>
                            <div style={S.scTop}>
                                <span style={{fontSize:'28px'}}>{st.ico}</span>
                                <span style={{...S.sv, color:st.accent}}>{st.v}</span>
                            </div>
                            <div style={S.sl}>{st.lbl}</div>
                        </div>
                    ))}
                </div>

                {/* Active filter indicator */}
                {activeFilter !== 'ALL' && (
                    <div style={S.filterIndicator}>
                        <span>🔍 Filtered by: <strong>{activeFilter.replace(/_/g,' ')}</strong></span>
                        <button
                            style={S.clearFilter}
                            onClick={() => { handleSidebarFilter('ALL','ALL'); }}>
                            ✕ Clear
                        </button>
                    </div>
                )}

                {/* Filter bar */}
                <div style={S.fb}>
                    <span style={{fontSize:'14px',color:'#6b6b6b'}}>🎛️ Filters:</span>
                    <select style={S.sel} value={typeF}
                        onChange={e => { doFilter(e.target.value, statusF); setActiveFilter(e.target.value); }}>
                        <option value="ALL">All Types</option>
                        <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                        <option value="LAB">🔬 Lab</option>
                        <option value="MEETING_ROOM">🤝 Meeting Room</option>
                        <option value="EQUIPMENT">📽️ Equipment</option>
                    </select>
                    <select style={S.sel} value={statusF}
                        onChange={e => { doFilter(typeF, e.target.value); setActiveFilter(e.target.value); }}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">✅ Active</option>
                        <option value="OUT_OF_SERVICE">🔧 Out of Service</option>
                    </select>
                    <button style={S.rb}
                        onClick={() => { doFilter('ALL','ALL'); setSearch(''); setActiveFilter('ALL'); }}>
                        ↺ Reset
                    <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                        onClick={() => { doFilter('ALL', 'ALL'); setSearch(''); }}>
                        <RefreshCcw className="h-3 w-3" /> Reset
                    </button>
                    <div style={{marginLeft:'auto'}}>
                        <span style={S.cp}>{filtered.length} results</span>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={S.lw}>
                        <div style={{fontSize:'36px', animation:'spin 1.5s linear infinite', display:'inline-block'}}>⚙️</div>
                        <div style={S.lt}>Loading resources...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={S.ec}>
                        <div style={{fontSize:'52px', marginBottom:'12px'}}>🔍</div>
                        <div style={S.et}>No resources found</div>
                        <div style={S.es}>Try adjusting your filters</div>
                    </div>
                ) : (
                    <div style={S.tc}>
                        <div style={S.th2}>
                            <span style={S.tt}>📋 Resource Catalogue</span>
                            <span style={S.tcnt}>{filtered.length} resources</span>
                        </div>
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead>
                                <tr style={{background:'#f0ede6'}}>
                                    {['Resource','Type','Location','Capacity','Availability','Status','Actions'].map(h => (
                                        <th key={h} style={S.thh}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r, i) => {
                                    const c = cfg(r.type);
                                    return (
                                        <tr key={r.id} className="tr-c row-c"
                                            style={{borderBottom:'1px solid #f0ede6', animationDelay:`${i*.04}s`}}>
                                            <td style={S.td}>
                                                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                                                    <div style={{...S.rib, background:c.bg}}>
                                                        <span style={{fontSize:'17px'}}>{c.icon}</span>
                                                    </div>
                                                    <div>
                                                        <div style={S.rn}>{r.name}</div>
                                                        <div style={S.ri}>ID #{r.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={S.td}>
                                                <span style={{...S.tp, background:c.bg, color:c.color}}>
                                                    {c.icon} {r.type?.replace(/_/g,' ')}
                                                </span>
                                            </td>
                                            <td style={S.td}>
                                                <span style={S.mu}>📍 {r.location}</span>
                                            </td>
                                            <td style={S.td}>
                                                <span style={S.mu}>{r.capacity > 0 ? `👥 ${r.capacity}` : '—'}</span>
                                            </td>
                                            <td style={S.td}>
                                                <span style={S.mu}>🕐 {r.availableFrom}–{r.availableTo}</span>
                                            </td>
                                            <td style={S.td}>
                                                <span style={{
                                                    display:'inline-flex', alignItems:'center', gap:'5px',
                                                    padding:'5px 12px', borderRadius:'20px',
                                                    fontSize:'12px', fontWeight:'600',
                                                    background: r.status==='ACTIVE' ? '#1a1a1a' : '#fff0ee',
                                                    color:      r.status==='ACTIVE' ? '#e8b923' : '#c0392b',
                                                }}>
                                                    {r.status==='ACTIVE' ? '● ACTIVE' : '● OUT OF SERVICE'}
                                                </span>
                                            </td>
                                            <td style={S.td}>
                                                <div style={{display:'flex', gap:'6px'}}>
                                                    <button className="btn-c" style={S.eb} onClick={() => onEdit(r)}>✏️ Edit</button>
                                                    <button className="btn-c" style={S.db} onClick={() => onDelete(r.id)}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* ── FORM MODAL ── */}
            {showForm && (
                <div style={S.ov}
                    onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
                    <div className="min" style={S.mb}>
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

const S = {
    layout:          {display:'flex',minHeight:'100vh',background:'#f5f3ee',fontFamily:"'DM Sans',sans-serif"},
    main:            {marginLeft:'260px',flex:1,padding:'32px'},
    topbar:          {display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'28px'},
    welcome:         {fontSize:'13px',color:'#aaa',marginBottom:'4px',fontWeight:'500'},
    title:           {fontSize:'30px',fontWeight:'700',color:'#1a1a1a',lineHeight:1.1},
    sub:             {fontSize:'13px',color:'#aaa',marginTop:'4px'},
    topRight:        {display:'flex',alignItems:'center',gap:'12px'},
    sw:              {display:'flex',alignItems:'center',gap:'8px',background:'#fff',border:'1px solid #e8e4da',borderRadius:'12px',padding:'10px 16px',boxShadow:'0 1px 6px rgba(0,0,0,.04)'},
    si:              {background:'none',border:'none',outline:'none',fontSize:'13px',color:'#1a1a1a',width:'170px',fontFamily:"'DM Sans',sans-serif"},
    addBtn:          {background:'#e8b923',color:'#1a1a1a',border:'none',padding:'11px 22px',borderRadius:'12px',fontSize:'13.5px',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 12px rgba(232,185,35,.3)',fontFamily:"'DM Sans',sans-serif",transition:'all .2s ease'},
    sg:              {display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'20px'},
    sc:              {background:'#fff',borderRadius:'14px',padding:'20px',boxShadow:'0 1px 6px rgba(0,0,0,.04)',border:'1px solid #f0ede6'},
    scTop:           {display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'},
    sv:              {fontSize:'36px',fontWeight:'800'},
    sl:              {fontSize:'12px',color:'#aaa',fontWeight:'500'},
    filterIndicator: {display:'flex',alignItems:'center',justifyContent:'space-between',background:'#fef3dc',border:'1px solid #f5d78a',borderRadius:'10px',padding:'10px 16px',marginBottom:'14px',fontSize:'13px',color:'#c47d0e',fontWeight:'500'},
    clearFilter:     {background:'none',border:'none',color:'#c47d0e',cursor:'pointer',fontSize:'12px',fontWeight:'700',fontFamily:"'DM Sans',sans-serif"},
    fb:              {display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1px solid #e8e4da',borderRadius:'12px',padding:'12px 18px',marginBottom:'20px',boxShadow:'0 1px 6px rgba(0,0,0,.04)'},
    sel:             {background:'#f5f3ee',border:'1px solid #e8e4da',color:'#1a1a1a',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',outline:'none',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
    rb:              {background:'#fff0ee',border:'1px solid #ffd0cc',color:'#c0392b',borderRadius:'8px',padding:'8px 12px',fontSize:'12px',fontWeight:'600',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
    cp:              {background:'#1a1a1a',color:'#e8b923',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'700'},
    lw:              {textAlign:'center',padding:'80px'},
    lt:              {marginTop:'14px',fontSize:'14px',color:'#aaa'},
    ec:              {textAlign:'center',padding:'80px',background:'#fff',borderRadius:'16px',border:'1px solid #e8e4da'},
    et:              {fontSize:'18px',fontWeight:'700',color:'#1a1a1a'},
    es:              {fontSize:'13px',color:'#aaa',marginTop:'6px'},
    tc:              {background:'#fff',borderRadius:'16px',border:'1px solid #e8e4da',boxShadow:'0 2px 12px rgba(0,0,0,.04)',overflow:'hidden'},
    th2:             {display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 22px',borderBottom:'1px solid #f0ede6',background:'#faf9f6'},
    tt:              {fontWeight:'700',fontSize:'15px',color:'#1a1a1a'},
    tcnt:            {background:'#1a1a1a',color:'#e8b923',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600'},
    thh:             {padding:'10px 18px',textAlign:'left',fontSize:'10px',fontWeight:'700',color:'#aaa',textTransform:'uppercase',letterSpacing:'.8px',borderBottom:'1px solid #f0ede6'},
    td:              {padding:'14px 18px',fontSize:'13.5px',color:'#333'},
    rib:             {width:'38px',height:'38px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
    rn:              {fontWeight:'600',color:'#1a1a1a',fontSize:'14px'},
    ri:              {fontSize:'11px',color:'#bbb',marginTop:'2px'},
    tp:              {display:'inline-block',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'},
    mu:              {color:'#888',fontSize:'13px'},
    eb:              {background:'#f5f3ee',color:'#1a1a1a',border:'1px solid #e8e4da',padding:'5px 12px',borderRadius:'8px',fontSize:'12px',fontWeight:'600',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
    db:              {background:'#fff0ee',color:'#c0392b',border:'1px solid #ffd0cc',padding:'5px 10px',borderRadius:'8px',fontSize:'12px',cursor:'pointer'},
    ov:              {position:'fixed',inset:0,zIndex:9999,background:'rgba(26,26,26,.5)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center'},
    mb:              {width:'580px',maxHeight:'92vh',overflowY:'auto',borderRadius:'20px',boxShadow:'0 40px 80px rgba(0,0,0,.2)'},
};