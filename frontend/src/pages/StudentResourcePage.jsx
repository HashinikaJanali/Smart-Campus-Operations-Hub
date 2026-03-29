import React, { useState, useEffect } from 'react';
import { getAllResources } from '../services/resourceService';

const injectStyles = () => {
    if (document.getElementById('crex-student')) return;
    const s = document.createElement('style');
    s.id = 'crex-student';
    s.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimY2  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spinS   { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes modalS  { from{opacity:0;transform:scale(.95) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes dotPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(232,185,35,.5)} 50%{box-shadow:0 0 0 5px rgba(232,185,35,0)} }

        body { background:#f5f3ee !important; }
        .cs  { font-family:'DM Sans',sans-serif !important; }

        .sa2 { animation:fadeUp .5s ease forwards; opacity:0; }
        .sa2:nth-child(1){animation-delay:.05s}
        .sa2:nth-child(2){animation-delay:.12s}
        .sa2:nth-child(3){animation-delay:.19s}
        .sa2:nth-child(4){animation-delay:.26s}

        .shimY2 {
            background:linear-gradient(90deg,#1a1a1a,#d4a017,#e8b923,#1a1a1a);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            animation:shimY2 3s linear infinite;
        }

        .card-s {
            transition:all .3s ease !important;
            cursor:pointer;
        }
        .card-s:hover {
            transform:translateY(-8px) scale(1.015) !important;
            box-shadow:0 20px 40px rgba(0,0,0,.1) !important;
            border-color:#e8b923 !important;
        }

        .pill-s {
            transition:all .2s ease !important;
            cursor:pointer;
        }
        .pill-s:hover {
            background:#1a1a1a !important;
            color:#e8b923 !important;
            border-color:#1a1a1a !important;
        }
        .pill-s.on {
            background:#1a1a1a !important;
            color:#e8b923 !important;
            border-color:#1a1a1a !important;
            font-weight:600 !important;
        }

        .modal-s { animation:modalS .35s cubic-bezier(.34,1.56,.64,1) forwards; }
        .float-b { animation:floatB 6s ease-in-out infinite; }
        .dot-act { animation:dotPulse 2s infinite; }
    `;
    document.head.appendChild(s);
};

const TC = {
    LECTURE_HALL: { icon:'🏛️', color:'#1a1a1a', bg:'#f0ede6', border:'#ddd9ce', label:'Lecture Hall' },
    LAB:          { icon:'🔬', color:'#c47d0e', bg:'#fef3dc', border:'#f5d78a', label:'Lab' },
    MEETING_ROOM: { icon:'🤝', color:'#2d6a4f', bg:'#d8f3dc', border:'#95d5b2', label:'Meeting Room' },
    EQUIPMENT:    { icon:'📽️', color:'#5e4b8b', bg:'#ede7f6', border:'#c5b8e8', label:'Equipment' },
};
const cfg = t => TC[t] || { icon:'📦', color:'#6b6b6b', bg:'#f0ede6', border:'#ddd9ce', label: t };

export default function StudentResourcePage() {
    const [resources, setResources] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState('');
    const [search,    setSearch]    = useState('');
    const [typeF,     setTypeF]     = useState('ALL');
    const [selected,  setSelected]  = useState(null);

    useEffect(() => { injectStyles(); load(); }, []);

    const load = async () => {
        try {
            setLoading(true); setError('');
            const d = await getAllResources();
            const active = d.filter(r => r.status === 'ACTIVE');
            setResources(active); setFiltered(active);
        } catch(e) {
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

    const handleType   = t => { setTypeF(t); applyFilter(t, search); };
    const handleSearch = e => { setSearch(e.target.value); applyFilter(typeF, e.target.value); };

    return (
        <div className="cs" style={P.page}>

            {/* ── HERO ── */}
            <div style={P.hero}>
                {/* Decorative shapes */}
                <div className="float-b" style={P.shape1}/>
                <div className="float-b" style={P.shape2}/>
                <div style={P.shape3}/>

                <div style={P.heroInner}>
                    <div style={P.heroLeft}>
                        <div style={P.badge}>🎓 Student Portal</div>
                        <h1 style={P.heroTitle}>
                            Find the perfect<br/>
                            <span className="shimY2">campus space</span>
                        </h1>
                        <p style={P.heroDesc}>
                            Discover available lecture halls, labs, meeting rooms and equipment across campus.
                        </p>
                        <div style={P.heroSearch}>
                            <span style={{fontSize:'16px',color:'#aaa'}}>🔍</span>
                            <input style={P.heroInp}
                                placeholder="Search rooms, labs, equipment..."
                                value={search} onChange={handleSearch}/>
                            <button style={P.refreshBtn} onClick={load}>🔄</button>
                        </div>
                    </div>

                    {/* Hero stats */}
                    <div style={P.heroStats}>
                        {[
                            {lbl:'Available', v:resources.length,                                    ico:'✅'},
                            {lbl:'Halls',     v:resources.filter(r=>r.type==='LECTURE_HALL').length, ico:'🏛️'},
                            {lbl:'Labs',      v:resources.filter(r=>r.type==='LAB').length,          ico:'🔬'},
                            {lbl:'Rooms',     v:resources.filter(r=>r.type==='MEETING_ROOM').length, ico:'🤝'},
                        ].map((st,i) => (
                            <div key={i} className="sa2" style={P.hStat}>
                                <span style={{fontSize:'22px'}}>{st.ico}</span>
                                <span style={P.hStatV}>{st.v}</span>
                                <span style={P.hStatL}>{st.lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={P.body}>

                {/* Error */}
                {error && (
                    <div style={P.errBox}>
                        ⚠️ {error}
                        <button style={P.retryBtn} onClick={load}>Retry</button>
                    </div>
                )}

                {/* Type Pills */}
                <div style={P.pillRow}>
                    {[
                        {t:'ALL',          ico:'🗂️', lbl:'All Resources'},
                        {t:'LECTURE_HALL', ico:'🏛️', lbl:'Lecture Halls'},
                        {t:'LAB',          ico:'🔬', lbl:'Labs'},
                        {t:'MEETING_ROOM', ico:'🤝', lbl:'Meeting Rooms'},
                        {t:'EQUIPMENT',    ico:'📽️', lbl:'Equipment'},
                    ].map(({t,ico,lbl}) => (
                        <button key={t} className={`pill-s ${typeF===t?'on':''}`}
                            style={{...P.pill, ...(typeF===t?P.pillOn:{})}}
                            onClick={()=>handleType(t)}>
                            {ico} {lbl}
                            {t!=='ALL' && (
                                <span style={{...P.pillCnt, background:typeF===t?'#e8b923':'#ede9e0', color:'#1a1a1a'}}>
                                    {resources.filter(r=>r.type===t).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Results info */}
                <div style={P.resInfo}>
                    Showing <strong style={{color:'#1a1a1a'}}>{filtered.length}</strong> available resources
                    {typeF!=='ALL' && <span style={{color:'#aaa'}}> · {cfg(typeF).label}</span>}
                    {search && <span style={{color:'#aaa'}}> · "{search}"</span>}
                </div>

                {/* Cards */}
                {loading ? (
                    <div style={P.lw}>
                        <div style={{fontSize:'36px',animation:'spinS 1.5s linear infinite',display:'inline-block'}}>⚙️</div>
                        <div style={P.lt}>Loading available resources...</div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={P.empty}>
                        <div style={{fontSize:'52px',marginBottom:'12px'}}>🔍</div>
                        <div style={P.et}>No resources found</div>
                        <div style={P.es}>Try a different filter</div>
                        <button style={P.clearBtn}
                            onClick={()=>{setSearch('');setTypeF('ALL');setFiltered(resources);}}>
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div style={P.grid}>
                        {filtered.map((r,i) => {
                            const c = cfg(r.type);
                            return (
                                <div key={r.id} className="card-s sa2"
                                    style={{...P.card, animationDelay:`${i*.06}s`}}
                                    onClick={()=>setSelected(r)}>

                                    {/* Yellow accent top */}
                                    <div style={P.cardAccent}/>

                                    <div style={P.cardHead}>
                                        <div style={{...P.cardIco, background:c.bg, border:`1px solid ${c.border}`}}>
                                            <span style={{fontSize:'24px'}}>{c.icon}</span>
                                        </div>
                                        <div style={P.activePill}>
                                            <span className="dot-act" style={P.dot}/>
                                            <span style={{fontSize:'11px',color:'#1a1a1a',fontWeight:'700'}}>ACTIVE</span>
                                        </div>
                                    </div>

                                    <div style={P.cardName}>{r.name}</div>

                                    <div style={P.metas}>
                                        <div style={P.meta}><span>📍</span><span>{r.location}</span></div>
                                        {r.capacity>0&&<div style={P.meta}><span>👥</span><span>Capacity {r.capacity}</span></div>}
                                        <div style={P.meta}><span>🕐</span><span>{r.availableFrom} – {r.availableTo}</span></div>
                                    </div>

                                    {r.description&&(
                                        <div style={P.cardDesc}>{r.description}</div>
                                    )}

                                    <div style={P.cardFoot}>
                                        <span style={{...P.tPill, color:c.color, background:c.bg, border:`1px solid ${c.border}`}}>
                                            {c.label}
                                        </span>
                                        <span style={{fontSize:'12px',color:'#e8b923',fontWeight:'700',background:'#1a1a1a',padding:'4px 10px',borderRadius:'20px'}}>
                                            View →
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
                <div style={P.overlay} onClick={()=>setSelected(null)}>
                    <div className="modal-s" style={P.modal} onClick={e=>e.stopPropagation()}>
                        <div style={{...P.mAccent, background:`linear-gradient(90deg,${cfg(selected.type).color},transparent)`}}/>

                        <div style={P.mHead}>
                            <div style={{...P.mIco, background:cfg(selected.type).bg, border:`1px solid ${cfg(selected.type).border}`}}>
                                <span style={{fontSize:'28px'}}>{cfg(selected.type).icon}</span>
                            </div>
                            <div style={{flex:1}}>
                                <h2 style={P.mTitle}>{selected.name}</h2>
                                <span style={{...P.mBadge, color:cfg(selected.type).color, background:cfg(selected.type).bg, border:`1px solid ${cfg(selected.type).border}`}}>
                                    {cfg(selected.type).label}
                                </span>
                            </div>
                            <button style={P.closeBtn} onClick={()=>setSelected(null)}>✕</button>
                        </div>

                        <div style={P.mDivider}/>

                        <div style={P.mGrid}>
                            {[
                                {lbl:'Location',    v:selected.location,            ico:'📍'},
                                {lbl:'Capacity',    v:selected.capacity||'N/A',     ico:'👥'},
                                {lbl:'Opens at',    v:selected.availableFrom,       ico:'🌅'},
                                {lbl:'Closes at',   v:selected.availableTo,         ico:'🌇'},
                                {lbl:'Status',      v:'ACTIVE',                     ico:'✅'},
                                {lbl:'Description', v:selected.description||'N/A',  ico:'📝'},
                            ].map(({lbl,v,ico})=>(
                                <div key={lbl} style={P.mItem}>
                                    <div style={P.mLbl}>{ico} {lbl}</div>
                                    <div style={{...P.mVal, color:lbl==='Status'?'#2d6a4f':'#1a1a1a'}}>{v}</div>
                                </div>
                            ))}
                        </div>

                        <div style={P.mFoot}>
                            <div style={P.avBadge}>✅ Available for Booking</div>
                            <button style={P.closeM} onClick={()=>setSelected(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const P = {
    page:   {minHeight:'100vh',background:'#f5f3ee',fontFamily:"'DM Sans',sans-serif"},
    hero:   {position:'relative',overflow:'hidden',background:'linear-gradient(135deg,#fff 0%,#faf7ef 60%,#f0ede6 100%)',borderBottom:'1px solid #e8e4da',padding:'48px 40px 44px'},
    shape1: {position:'absolute',top:'-60px',right:'10%',width:'200px',height:'200px',background:'#e8b923',borderRadius:'50%',opacity:.08,pointerEvents:'none'},
    shape2: {position:'absolute',bottom:'-40px',right:'5%',width:'150px',height:'150px',background:'#1a1a1a',borderRadius:'50%',opacity:.05,pointerEvents:'none'},
    shape3: {position:'absolute',top:'30%',right:'38%',width:'80px',height:'80px',background:'#e8b923',borderRadius:'50%',opacity:.06,pointerEvents:'none'},
    heroInner:{display:'flex',justifyContent:'space-between',alignItems:'center',maxWidth:'1200px',gap:'40px',position:'relative',zIndex:1},
    heroLeft: {flex:1},
    badge:  {display:'inline-flex',alignItems:'center',gap:'6px',background:'#1a1a1a',color:'#e8b923',padding:'5px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:'700',marginBottom:'16px',letterSpacing:'.5px'},
    heroTitle:{fontSize:'40px',fontWeight:'800',color:'#1a1a1a',lineHeight:1.15,margin:'0 0 12px'},
    heroDesc: {color:'#888',fontSize:'15px',lineHeight:1.6,marginBottom:'24px',maxWidth:'480px'},
    heroSearch:{display:'flex',alignItems:'center',gap:'10px',background:'#fff',border:'1px solid #e8e4da',borderRadius:'14px',padding:'12px 16px',maxWidth:'480px',boxShadow:'0 2px 12px rgba(0,0,0,.06)'},
    heroInp:  {flex:1,background:'none',border:'none',outline:'none',fontSize:'14px',color:'#1a1a1a',fontFamily:"'DM Sans',sans-serif"},
    refreshBtn:{background:'#1a1a1a',color:'#e8b923',border:'none',borderRadius:'8px',padding:'7px 14px',fontSize:'14px',cursor:'pointer'},
    heroStats:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',flexShrink:0},
    hStat:  {background:'#fff',border:'1px solid #e8e4da',borderRadius:'14px',padding:'16px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',boxShadow:'0 2px 8px rgba(0,0,0,.04)',minWidth:'100px'},
    hStatV: {fontSize:'28px',fontWeight:'800',color:'#1a1a1a'},
    hStatL: {fontSize:'11px',color:'#aaa',fontWeight:'600'},
    body:   {padding:'28px 40px 60px'},
    errBox: {background:'#fff0ee',border:'1px solid #ffd0cc',borderRadius:'12px',padding:'14px 18px',color:'#c0392b',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'},
    retryBtn:{background:'#fff',border:'1px solid #ffd0cc',color:'#c0392b',borderRadius:'6px',padding:'5px 12px',fontSize:'12px',cursor:'pointer'},
    pillRow:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'},
    pill:   {display:'flex',alignItems:'center',gap:'6px',background:'#fff',border:'1px solid #e8e4da',color:'#6b6b6b',borderRadius:'10px',padding:'8px 16px',fontSize:'13px',fontWeight:'500',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 1px 4px rgba(0,0,0,.04)',transition:'all .2s ease'},
    pillOn: {background:'#1a1a1a',color:'#e8b923',borderColor:'#1a1a1a',fontWeight:'600'},
    pillCnt:{padding:'1px 7px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',marginLeft:'2px'},
    resInfo:{fontSize:'13px',color:'#aaa',marginBottom:'20px'},
    lw:     {textAlign:'center',padding:'80px'},
    lt:     {marginTop:'14px',fontSize:'14px',color:'#aaa'},
    empty:  {textAlign:'center',padding:'80px',background:'#fff',borderRadius:'16px',border:'1px solid #e8e4da',boxShadow:'0 2px 12px rgba(0,0,0,.04)'},
    et:     {fontSize:'20px',fontWeight:'700',color:'#1a1a1a'},
    es:     {fontSize:'14px',color:'#aaa',marginTop:'8px'},
    clearBtn:{marginTop:'20px',background:'#1a1a1a',color:'#e8b923',border:'none',borderRadius:'8px',padding:'9px 20px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
    grid:   {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'20px'},
    card:   {background:'#fff',border:'1px solid #e8e4da',borderRadius:'16px',padding:'22px',position:'relative',overflow:'hidden',boxShadow:'0 2px 10px rgba(0,0,0,.05)'},
    cardAccent:{position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,#e8b923,#f5d878)'},
    cardHead:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'14px'},
    cardIco:{width:'50px',height:'50px',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center'},
    activePill:{display:'flex',alignItems:'center',gap:'5px',background:'#f5f3ee',border:'1px solid #e8e4da',borderRadius:'20px',padding:'3px 10px'},
    dot:    {width:'7px',height:'7px',borderRadius:'50%',background:'#e8b923',display:'inline-block'},
    cardName:{fontSize:'17px',fontWeight:'700',color:'#1a1a1a',marginBottom:'12px'},
    metas:  {display:'flex',flexDirection:'column',gap:'6px',marginBottom:'12px'},
    meta:   {display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#888'},
    cardDesc:{fontSize:'12px',color:'#bbb',fontStyle:'italic',marginBottom:'12px',paddingLeft:'10px',borderLeft:'2px solid #e8e4da'},
    cardFoot:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'8px'},
    tPill:  {display:'inline-block',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'},
    overlay:{position:'fixed',inset:0,zIndex:9999,background:'rgba(26,26,26,.5)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center'},
    modal:  {background:'#fff',borderRadius:'20px',width:'520px',padding:'28px',position:'relative',overflow:'hidden',boxShadow:'0 40px 80px rgba(0,0,0,.2)',maxHeight:'90vh',overflowY:'auto'},
    mAccent:{position:'absolute',top:0,left:0,right:0,height:'3px'},
    mHead:  {display:'flex',alignItems:'flex-start',gap:'16px',marginBottom:'20px'},
    mIco:   {width:'58px',height:'58px',borderRadius:'16px',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'},
    mTitle: {fontSize:'22px',fontWeight:'800',color:'#1a1a1a',margin:'0 0 6px'},
    mBadge: {display:'inline-block',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'},
    closeBtn:{marginLeft:'auto',background:'#f5f3ee',border:'1px solid #e8e4da',color:'#6b6b6b',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',fontSize:'14px',flexShrink:0},
    mDivider:{height:'1px',background:'#f5f3ee',marginBottom:'20px'},
    mGrid:  {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'24px'},
    mItem:  {background:'#faf9f6',border:'1px solid #f0ede6',borderRadius:'10px',padding:'12px 14px'},
    mLbl:   {fontSize:'11px',color:'#bbb',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'5px'},
    mVal:   {fontSize:'14px',fontWeight:'600',color:'#1a1a1a'},
    mFoot:  {display:'flex',justifyContent:'space-between',alignItems:'center'},
    avBadge:{background:'#f5f3ee',border:'1px solid #e8e4da',color:'#2d6a4f',borderRadius:'8px',padding:'8px 14px',fontSize:'12px',fontWeight:'600'},
    closeM: {background:'#1a1a1a',color:'#e8b923',border:'none',borderRadius:'10px',padding:'10px 24px',fontSize:'13px',fontWeight:'700',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
};