import React, { useState, useEffect } from 'react';
import { addResource, updateResource } from '../../services/resourceService';

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
        <div style={F.box}>

            {/* Yellow accent top */}
            <div style={F.accent}/>

            {/* Header */}
            <div style={F.header}>
                <div>
                    <h2 style={F.title}>
                        {existingResource ? '✏️ Edit Resource' : '➕ Add New Resource'}
                    </h2>
                    <p style={F.sub}>
                        {existingResource
                            ? 'Update the resource details below'
                            : 'Fill in the details to add a new resource'}
                    </p>
                </div>
                <button style={F.closeBtn} onClick={onClose}>✕</button>
            </div>

            <div style={F.divider}/>

            {/* Error */}
            {error && <div style={F.err}>⚠️ {error}</div>}

            {/* Fields */}
            <div style={F.row}>
                <div style={F.grp}>
                    <label style={F.lbl}>Resource Name *</label>
                    <input style={F.inp} name="name"
                        value={formData.name} onChange={handleChange}
                        placeholder="e.g. Lecture Hall A"/>
                </div>
                <div style={F.grp}>
                    <label style={F.lbl}>Type</label>
                    <select style={F.inp} name="type"
                        value={formData.type} onChange={handleChange}>
                        <option value="LECTURE_HALL">🏛️ Lecture Hall</option>
                        <option value="LAB">🔬 Lab</option>
                        <option value="MEETING_ROOM">🤝 Meeting Room</option>
                        <option value="EQUIPMENT">📽️ Equipment</option>
                    </select>
                </div>
            </div>

            <div style={F.row}>
                <div style={F.grp}>
                    <label style={F.lbl}>Location *</label>
                    <input style={F.inp} name="location"
                        value={formData.location} onChange={handleChange}
                        placeholder="e.g. Block A, Floor 1"/>
                </div>
                <div style={F.grp}>
                    <label style={F.lbl}>Capacity</label>
                    <input style={F.inp} name="capacity" type="number"
                        value={formData.capacity} onChange={handleChange}
                        placeholder="e.g. 120"/>
                </div>
            </div>

            <div style={F.row}>
                <div style={F.grp}>
                    <label style={F.lbl}>Available From</label>
                    <input style={F.inp} name="availableFrom" type="time"
                        value={formData.availableFrom} onChange={handleChange}/>
                </div>
                <div style={F.grp}>
                    <label style={F.lbl}>Available To</label>
                    <input style={F.inp} name="availableTo" type="time"
                        value={formData.availableTo} onChange={handleChange}/>
                </div>
            </div>

            <div style={F.row}>
                <div style={F.grp}>
                    <label style={F.lbl}>Status</label>
                    <select style={F.inp} name="status"
                        value={formData.status} onChange={handleChange}>
                        <option value="ACTIVE">✅ Active</option>
                        <option value="OUT_OF_SERVICE">🔧 Out of Service</option>
                    </select>
                </div>
                <div style={F.grp}>
                    <label style={F.lbl}>Description</label>
                    <input style={F.inp} name="description"
                        value={formData.description} onChange={handleChange}
                        placeholder="e.g. Has projector and AC"/>
                </div>
            </div>

            {/* Footer */}
            <div style={F.footer}>
                <button style={F.cancelBtn} onClick={onClose}>Cancel</button>
                <button style={F.saveBtn} onClick={handleSubmit} disabled={loading}>
                    {loading ? '⏳ Saving...'
                        : existingResource ? '✅ Update Resource'
                        : '➕ Add Resource'}
                </button>
            </div>
        </div>
    );
}

const F = {
    box: {
        background:'#ffffff', borderRadius:'20px', padding:'32px',
        width:'100%', fontFamily:"'DM Sans',sans-serif",
        position:'relative', overflow:'hidden',
    },
    accent: {
        position:'absolute', top:0, left:0, right:0, height:'4px',
        background:'linear-gradient(90deg,#e8b923,#f5d878)',
    },
    header: {
        display:'flex', justifyContent:'space-between',
        alignItems:'flex-start', marginBottom:'20px', marginTop:'8px',
    },
    title:  {fontSize:'22px',fontWeight:'800',color:'#1a1a1a',margin:0},
    sub:    {fontSize:'13px',color:'#aaa',marginTop:'4px'},
    closeBtn:{background:'#f5f3ee',border:'1px solid #e8e4da',color:'#6b6b6b',borderRadius:'8px',padding:'6px 12px',cursor:'pointer',fontSize:'16px',fontWeight:'700',flexShrink:0},
    divider:{height:'1px',background:'#f5f3ee',marginBottom:'20px'},
    err:    {background:'#fff0ee',border:'1px solid #ffd0cc',borderRadius:'8px',padding:'12px 16px',color:'#c0392b',fontSize:'13px',marginBottom:'16px'},
    row:    {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'4px'},
    grp:    {marginBottom:'16px'},
    lbl:    {display:'block',fontSize:'11px',fontWeight:'700',color:'#888',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px'},
    inp:    {width:'100%',background:'#faf9f6',border:'1px solid #e8e4da',borderRadius:'10px',padding:'11px 14px',color:'#1a1a1a',fontSize:'14px',outline:'none',fontFamily:"'DM Sans',sans-serif",boxSizing:'border-box',transition:'border-color .2s'},
    footer: {display:'flex',justifyContent:'flex-end',gap:'10px',marginTop:'8px',paddingTop:'16px',borderTop:'1px solid #f5f3ee'},
    cancelBtn:{background:'#f5f3ee',border:'1px solid #e8e4da',color:'#6b6b6b',borderRadius:'10px',padding:'11px 22px',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"},
    saveBtn:{background:'#1a1a1a',color:'#e8b923',border:'none',borderRadius:'10px',padding:'11px 28px',fontSize:'14px',fontWeight:'700',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",boxShadow:'0 4px 14px rgba(26,26,26,.2)'},
};