import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const injectStyles = () => {
    if (document.getElementById('sidebar-styles')) return;
    const s = document.createElement('style');
    s.id = 'sidebar-styles';
    s.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes slideDown {
            from { opacity:0; transform:translateY(-6px); }
            to   { opacity:1; transform:translateY(0); }
        }

        .nav-c {
            display:flex; align-items:center; gap:10px;
            padding:9px 12px; border-radius:10px;
            font-size:13.5px; color:#6b6b6b; cursor:pointer;
            margin-bottom:2px; transition:all .2s ease;
            font-weight:500; border:1px solid transparent;
            font-family:'DM Sans',sans-serif;
        }
        .nav-c:hover { background:#eceae4; color:#1a1a1a; }
        .nav-c.on    { background:#1a1a1a; color:#fff; font-weight:600; }

        .nav-sub {
            display:flex; align-items:center; gap:10px;
            padding:7px 12px 7px 28px; border-radius:8px;
            font-size:12.5px; color:#888; cursor:pointer;
            margin-bottom:2px; transition:all .2s ease;
            font-weight:500;
            font-family:'DM Sans',sans-serif;
        }
        .nav-sub:hover { background:#eceae4; color:#1a1a1a; }
        .nav-sub.on    { background:#fef3dc; color:#c47d0e; font-weight:600; border-left:2px solid #e8b923; padding-left:26px; }

        .nav-disabled {
            display:flex; align-items:center; gap:10px;
            padding:7px 12px 7px 28px; border-radius:8px;
            font-size:12.5px; color:#ccc; cursor:not-allowed;
            margin-bottom:2px; font-weight:500;
            font-family:'DM Sans',sans-serif;
        }

        .section-header {
            display:flex; align-items:center; gap:8px;
            padding:9px 12px; border-radius:10px;
            cursor:pointer; transition:all .2s ease;
            margin-bottom:2px; user-select:none;
            font-family:'DM Sans',sans-serif;
        }
        .section-header:hover { background:#eceae4; }

        .section-body {
            animation: slideDown .2s ease forwards;
            overflow: hidden;
        }

        .soon-tag {
            font-size:9px; font-weight:700;
            background:#f0ede6; color:#bbb;
            padding:2px 7px; border-radius:20px;
        }
    `;
    document.head.appendChild(s);
};

export default function Sidebar({ onFilterChange, onAddResource, activeFilter }) {
    const navigate  = useNavigate();
    const location  = useLocation();
    const path      = location.pathname;

    // Track which sections are open
    const [open, setOpen] = useState({
        m1: true,   // Member 1 open by default
        m2: false,
        m3: false,
        m4: false,
    });

    injectStyles();

    const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }));
    const isOn   = route  => path === route;
    const isSubOn= filter => activeFilter === filter;

    const handleFilter = (type, status) => {
        navigate('/resourseadmin');
        onFilterChange && onFilterChange(type, status);
    };

    const handleAdd = () => {
        navigate('/resourseadmin');
        onAddResource && onAddResource();
    };

    // Section header component
    const SectionHeader = ({ sectionKey, icon, label, badge, badgeColor, isActive }) => (
        <div
            className="section-header"
            style={{ background: isActive ? '#f5f0e0' : 'transparent' }}
            onClick={() => toggle(sectionKey)}
        >
            <span style={{ fontSize:'15px' }}>{icon}</span>
            <span style={{
                flex:1, fontSize:'12px', fontWeight:'700',
                color: isActive ? '#1a1a1a' : '#888',
                textTransform:'uppercase', letterSpacing:'0.8px',
            }}>
                {label}
            </span>
            <span style={{
                fontSize:'9px', fontWeight:'700',
                background: badgeColor, color:'#fff',
                padding:'2px 6px', borderRadius:'20px',
                marginRight:'4px',
            }}>
                {badge}
            </span>
            <span style={{
                fontSize:'12px', color:'#aaa',
                transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition:'transform .2s ease',
                display:'inline-block',
            }}>
                ▾
            </span>
        </div>
    );

    return (
        <aside style={{
            width:'260px', background:'#fff',
            borderRight:'1px solid #e8e4da',
            display:'flex', flexDirection:'column',
            padding:'22px 14px',
            position:'fixed', top:0, left:0, bottom:0,
            zIndex:50, boxShadow:'2px 0 16px rgba(0,0,0,.05)',
            fontFamily:"'DM Sans',sans-serif",
            overflowY:'auto',
        }}>

            {/* ── LOGO ── */}
            <div style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding:'0 6px 20px',
                borderBottom:'1px solid #f0ede6', marginBottom:'14px',
                flexShrink:0,
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    <img 
                        src="/unioplogo.png" 
                        alt="Logo" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div>
                    <div style={{fontWeight:'700',fontSize:'15px',color:'#1a1a1a'}}>UniOps</div>
                    <div style={{fontSize:'11px',color:'#aaa',marginTop:'1px'}}>Smart Campus Operations Hub</div>
                </div>
            </div>

            {/* ══════════════════════════════════
                MEMBER 1 – Facilities & Assets ✅
                ══════════════════════════════════ */}
            <SectionHeader
                sectionKey="m1"
                icon="🏛️"
                label="Facilities & Assets"
                badge="M1"
                badgeColor="#e8b923"
                isActive={path.includes('resourse')}
            />

            {open.m1 && (
                <div className="section-body" style={{marginBottom:'6px'}}>

                    {/* Main actions */}
                    
                    <div className="nav-c"
                        onClick={handleAdd}>
                        <span>➕</span>
                        <span style={{flex:1}}>Add New Resource</span>
                    </div>

                    {/* Quick filters label */}
                    <div style={{
                        fontSize:'9px', fontWeight:'700', color:'#ccc',
                        letterSpacing:'1.5px', textTransform:'uppercase',
                        padding:'8px 12px 4px',
                    }}>
                        QUICK FILTERS
                    </div>

                    <div className={`nav-sub ${isSubOn('ALL')?'on':''}`}
                        onClick={()=>handleFilter('ALL','ALL')}>
                        <span>📋</span><span style={{flex:1}}>All Resources</span>
                    </div>

                    <div className={`nav-sub ${isSubOn('ACTIVE')?'on':''}`}
                        onClick={()=>handleFilter('ALL','ACTIVE')}>
                        <span>✅</span><span style={{flex:1}}>Active Only</span>
                    </div>

                    <div className={`nav-sub ${isSubOn('OUT_OF_SERVICE')?'on':''}`}
                        onClick={()=>handleFilter('ALL','OUT_OF_SERVICE')}>
                        <span>🔧</span><span style={{flex:1}}>Out of Service</span>
                    </div>

                   

                    {/* Views label */}
                    <div style={{
                        fontSize:'9px', fontWeight:'700', color:'#ccc',
                        letterSpacing:'1.5px', textTransform:'uppercase',
                        padding:'8px 12px 4px',
                    }}>
                        VIEWS
                    </div>

                    <div className={`nav-sub ${isOn('/resoursestudent')?'on':''}`}
                        onClick={()=>navigate('/resoursestudent')}>
                        <span>👤</span>
                        <span style={{flex:1}}>Student View</span>
                    </div>
                </div>
            )}

            <div style={{height:'1px',background:'#f0ede6',margin:'4px 0'}}/>

            {/* ══════════════════════════════════
                MEMBER 2 – Booking Management
                ══════════════════════════════════ */}
            <SectionHeader
                sectionKey="m2"
                icon="📅"
                label="Booking Management"
                badge="M2"
                badgeColor="#3b82f6"
                isActive={false}
            />

            {open.m2 && (
                <div className="section-body" style={{marginBottom:'6px'}}>
                    {[
                        {ico:'📋', lbl:'All Bookings'},
                        {ico:'⏳', lbl:'Pending Approvals'},
                        {ico:'✅', lbl:'Approved'},
                        {ico:'❌', lbl:'Rejected'},
                        {ico:'🚫', lbl:'Cancelled'},
                    ].map((item,i) => (
                        <div key={i} className="nav-disabled">
                            <span>{item.ico}</span>
                            <span style={{flex:1}}>{item.lbl}</span>
                            <span className="soon-tag">Soon</span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{height:'1px',background:'#f0ede6',margin:'4px 0'}}/>

            {/* ══════════════════════════════════
                MEMBER 3 – Maintenance Tickets
                ══════════════════════════════════ */}
            <SectionHeader
                sectionKey="m3"
                icon="🔧"
                label="Maintenance Tickets"
                badge="M3"
                badgeColor="#10b981"
                isActive={false}
            />

            {open.m3 && (
                <div className="section-body" style={{marginBottom:'6px'}}>
                    {[
                        {ico:'🎫', lbl:'All Tickets'},
                        {ico:'🔴', lbl:'Open'},
                        {ico:'🔵', lbl:'In Progress'},
                        {ico:'✅', lbl:'Resolved'},
                        {ico:'🔒', lbl:'Closed'},
                        {ico:'👨‍🔧', lbl:'Assigned'},
                    ].map((item,i) => (
                        <div key={i} className="nav-disabled">
                            <span>{item.ico}</span>
                            <span style={{flex:1}}>{item.lbl}</span>
                            <span className="soon-tag">Soon</span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{height:'1px',background:'#f0ede6',margin:'4px 0'}}/>

            {/* ══════════════════════════════════
                MEMBER 4 – Notifications & Auth
                ══════════════════════════════════ */}
            <SectionHeader
                sectionKey="m4"
                icon="🔔"
                label="Notifications & Auth"
                badge="M4"
                badgeColor="#8b5cf6"
                isActive={false}
            />

            {open.m4 && (
                <div className="section-body" style={{marginBottom:'6px'}}>
                    {[
                        {ico:'🔔', lbl:'Notifications'},
                        {ico:'👥', lbl:'User Management'},
                        {ico:'🔑', lbl:'OAuth / Login'},
                        {ico:'🛡️', lbl:'Roles & Permissions'},
                    ].map((item,i) => (
                        <div key={i} className="nav-disabled">
                            <span>{item.ico}</span>
                            <span style={{flex:1}}>{item.lbl}</span>
                            <span className="soon-tag">Soon</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── FOOTER ── */}
            <div style={{
                marginTop:'auto', padding:'16px 6px 0',
                borderTop:'1px solid #f0ede6',
                display:'flex', alignItems:'center', gap:'10px',
                flexShrink:0,
            }}>
                <div style={{
                    width:'36px', height:'36px', borderRadius:'50%',
                    background:'#1a1a1a', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    fontSize:'14px', fontWeight:'700', color:'#e8b923',
                    flexShrink:0,
                }}>A</div>
                <div>
                    <div style={{fontSize:'13px',fontWeight:'700',color:'#1a1a1a'}}>Admin User</div>
                    <div style={{fontSize:'11px',color:'#aaa'}}>System Administrator</div>
                </div>
            </div>
        </aside>
    );
}