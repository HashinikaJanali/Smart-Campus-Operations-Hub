import React, { useState, useEffect, useRef, useCallback } from 'react';
import UserHeader from '../components/common/UserHeader';
import useRequireAuth from '../hooks/userRequireAuth';
import { useNotificationRefresh } from '../contexts/NotificationContext';
import {
    Plus, X, AlertCircle, CheckCircle2, Clock, Wrench,
    ChevronDown, ChevronUp, MessageSquare, Send, Pencil,
    Trash2, Image, Upload, Tag, MapPin, Phone, Mail,
    FileText, AlertTriangle, Loader2, RefreshCw, XCircle, Timer
} from 'lucide-react';
import {
    createTicket, getMyTickets, getAllTickets, getComments,
    addComment, editComment, deleteComment,
    resolveTicketImageUrl
} from '../services/ticketService';

const CATEGORIES = [
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'HVAC', label: 'HVAC / Air Conditioning' },
    { value: 'IT_EQUIPMENT', label: 'IT / Equipment' },
    { value: 'FURNITURE', label: 'Furniture' },
    { value: 'SAFETY', label: 'Safety & Security' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'OTHER', label: 'Other' },
];

const PRIORITIES = [
    { value: 'LOW', label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    { value: 'MEDIUM', label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
];

const STATUSES = {
    OPEN: { label: 'Open', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: AlertCircle },
    IN_PROGRESS: { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Wrench },
    RESOLVED: { label: 'Resolved', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
    CLOSED: { label: 'Closed', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: XCircle },
    REJECTED: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SRI_LANKAN_PHONE_PATTERN = /^(?:\+94|0)7\d{8}$/;
const MIN_DESCRIPTION_WORDS = 5;

function normalizePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/[\s()-]/g, '');
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── TIMER HELPER ─────────────────────────────────────────────────────────────
// Converts two ISO date strings into a human-readable duration e.g. "2h 15m"
function formatDuration(from, to) {
    if (!from) return null;
    const start = new Date(from);
    const end = to ? new Date(to) : new Date();
    const totalMinutes = Math.floor((end - start) / 60000);
    if (totalMinutes < 1) return '< 1m';
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const mins = totalMinutes % 60;
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

// Shows the two SLA timers — used in both TicketCard and AdminTicketCard
function SlaTimers({ ticket }) {
    const responseTime = formatDuration(ticket.createdAt, ticket.firstResponseAt);
    const resolutionTime = formatDuration(ticket.createdAt, ticket.resolvedAt);
    const isOpen = !['RESOLVED', 'CLOSED', 'REJECTED'].includes(ticket.status);
    const hasResponded = Boolean(ticket.firstResponseAt) || ticket.status !== 'OPEN';
    const responseDisplay = ticket.firstResponseAt
        ? responseTime
        : hasResponded
            ? formatDuration(ticket.createdAt, ticket.updatedAt)
            : 'Awaiting response';

    if (!responseTime && !resolutionTime && ticket.status === 'OPEN') return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {/* Time to first response */}
            <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold
                ${hasResponded
                    ? 'border-indigo-100 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                <Timer className="h-3 w-3" />
                <span>Response: </span>
                <span>{responseDisplay}</span>
            </div>

            {/* Time to resolution */}
            <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold
                ${ticket.resolvedAt
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : isOpen
                        ? 'border-amber-100 bg-amber-50 text-amber-600'
                        : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                <Clock className="h-3 w-3" />
                <span>Resolution: </span>
                <span>
                    {ticket.resolvedAt
                        ? resolutionTime
                        : isOpen
                            ? `${formatDuration(ticket.createdAt, null)} elapsed`
                            : 'N/A'}
                </span>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const s = STATUSES[status] || STATUSES.OPEN;
    const Icon = s.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${s.color} ${s.bg} ${s.border}`}>
            <Icon className="h-3 w-3" />{s.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const p = PRIORITIES.find(x => x.value === priority) || PRIORITIES[1];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${p.color} ${p.bg} ${p.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />{p.label}
        </span>
    );
}

function CreateTicketModal({ onClose, onCreated }) {
    const [form, setForm] = useState({
        resource: '', location: '', category: 'IT_EQUIPMENT',
        description: '', priority: 'MEDIUM',
        contactPhone: '', contactEmail: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setFieldErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const nextErrors = {};

        // Keep the ticket title fields populated so support staff get the core issue context.
        if (!form.resource.trim() || !form.location.trim()) {
            nextErrors.general = 'Resource and Location are required.';
        }

        // Block short descriptions so tickets contain enough detail to act on.
        if (countWords(form.description || '') < MIN_DESCRIPTION_WORDS) {
            nextErrors.description = `Description must be at least ${MIN_DESCRIPTION_WORDS} words.`;
        }

        // Validate the contact email only when the user provides one.
        if (form.contactEmail && !EMAIL_PATTERN.test(form.contactEmail.trim())) {
            nextErrors.contactEmail = 'Enter a valid email address.';
        }

        // Accept standard Sri Lankan mobile formats such as 0771234567 or +94771234567.
        if (form.contactPhone) {
            const normalizedPhone = normalizePhoneNumber(form.contactPhone.trim());
            if (!SRI_LANKAN_PHONE_PATTERN.test(normalizedPhone)) {
                nextErrors.contactPhone = 'Enter a valid Sri Lankan mobile number, such as 0771234567 or +94771234567.';
            }
        }

        setFieldErrors(nextErrors);
        return nextErrors;
    };

    const handleImages = e => {
        const files = Array.from(e.target.files);
        const combined = [...images, ...files].slice(0, 3);
        setImages(combined);
        setPreviews(combined.map(f => URL.createObjectURL(f)));
    };

    const removeImage = idx => {
        const imgs = images.filter((_, i) => i !== idx);
        const prevs = previews.filter((_, i) => i !== idx);
        setImages(imgs); setPreviews(prevs);
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm();
        if (Object.keys(nextErrors).length > 0) {
            setError(nextErrors.general || 'Please correct the highlighted fields.');
            return;
        }
        try {
            setLoading(true); setError('');
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            images.forEach(img => fd.append('images', img));
            fd.append('userId', localStorage.getItem('userId') || '');
            fd.append('submittedBy', localStorage.getItem('username') || 'anonymous');
            await createTicket(fd);
            onCreated();
        } catch (e) {
            console.error(e);
            setError('Failed to submit. Check backend connection.');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-blue-400" />
                <div className="p-7 pt-8">
                    <div className="mb-5 flex items-start justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
                                <Plus className="h-5 w-5 text-indigo-600" /> Create Incident Ticket
                            </h2>
                            <p className="mt-0.5 text-sm text-slate-500">Report a maintenance issue or facility problem</p>
                        </div>
                        <button onClick={onClose} className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="mb-5 h-px bg-slate-100" />
                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertCircle className="h-4 w-4 shrink-0" />{error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">Resource / Item *</label>
                                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                                    name="resource" value={form.resource} onChange={handleChange} placeholder="e.g. Projector, AC Unit" />
                            </div>
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><MapPin className="h-3 w-3" /> Location *</label>
                                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                                    name="location" value={form.location} onChange={handleChange} placeholder="e.g. Block A, Room 201" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><Tag className="h-3 w-3" /> Category</label>
                                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
                                    name="category" value={form.category} onChange={handleChange}>
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><AlertTriangle className="h-3 w-3" /> Priority</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {PRIORITIES.map(p => (
                                        <button key={p.value} onClick={() => setForm({ ...form, priority: p.value })}
                                            className={`rounded-lg border py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${form.priority === p.value ? `${p.bg} ${p.border} ${p.color} shadow-sm` : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'}`}>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><FileText className="h-3 w-3" /> Description *</label>
                            <textarea className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors resize-none focus:bg-white focus:ring-2 ${fieldErrors.description ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                rows={3} name="description" value={form.description} onChange={handleChange} placeholder="Describe the issue in detail..." />
                            {fieldErrors.description && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.description}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><Phone className="h-3 w-3" /> Contact Phone</label>
                                <input className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:bg-white focus:ring-2 ${fieldErrors.contactPhone ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                    name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="+94 77 123 4567" inputMode="tel" autoComplete="tel" />
                                {fieldErrors.contactPhone && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.contactPhone}</p>}
                            </div>
                            <div>
                                <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><Mail className="h-3 w-3" /> Contact Email</label>
                                <input className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:bg-white focus:ring-2 ${fieldErrors.contactEmail ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'}`}
                                    name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="you@university.edu" type="email" autoComplete="email" />
                                {fieldErrors.contactEmail && <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.contactEmail}</p>}
                            </div>
                        </div>
                        <div>
                            {/* Optional evidence images help support staff verify the issue, with a max of 3 uploads. */}
                            <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                <Image className="h-3 w-3" /> Evidence Images <span className="text-slate-400 normal-case font-medium">(max 3)</span>
                            </label>
                            <div className="flex items-center gap-3 flex-wrap">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                        <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                                        <button onClick={() => removeImage(i)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 3 && (
                                    <button onClick={() => fileRef.current.click()}
                                        className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                                        <Upload className="h-5 w-5 mb-1" />
                                        <span className="text-[10px] font-bold">Upload</span>
                                    </button>
                                )}
                                {/* Accepts common image formats such as JPG and PNG via image/* */}
                                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <button onClick={onClose} className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-bold text-white shadow-md hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><CheckCircle2 className="h-4 w-4" /> Submit Ticket</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommentSection({ ticketId, onRefreshNotifications, isLoggedIn }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');
    const [loading, setLoading] = useState(false);
    const currentUser = localStorage.getItem('username') || 'You';

    const fetchComments = async () => {
        try { const res = await getComments(ticketId); setComments(res.data); } catch { }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchComments(); }, [ticketId]);

    const handleAdd = async () => {
        if (!text.trim()) return;
        try {
            setLoading(true);
            await addComment(ticketId, text.trim(), currentUser);
            setText(''); fetchComments();
            if (onRefreshNotifications) onRefreshNotifications();
        } finally { setLoading(false); }
    };

    const handleEdit = async (commentId) => {
        await editComment(ticketId, commentId, editText, currentUser);
        setEditId(null); fetchComments();
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        await deleteComment(ticketId, commentId, currentUser);
        fetchComments();
    };

    if (!isLoggedIn) {
        return (
            <div className="mt-4">
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                    <MessageSquare className="h-3.5 w-3.5" /> Comments ({comments.length})
                </h4>
                {comments.length === 0 && <p className="text-xs text-slate-400 italic">No comments yet.</p>}
                {comments.map(c => (
                    <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 mb-2">
                        <span className="text-[11px] font-bold text-indigo-600">{c.authorName || 'User'}</span>
                        <span className="mx-1.5 text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
                        <p className="mt-1 text-sm text-slate-700">{c.text}</p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                <MessageSquare className="h-3.5 w-3.5" /> Comments ({comments.length})
            </h4>
            {comments.length === 0 && <p className="text-xs text-slate-400 italic">No comments yet.</p>}
            {comments.map(c => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    {editId === c.id ? (
                        <div className="flex gap-2">
                            <input className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
                                value={editText} onChange={e => setEditText(e.target.value)} />
                            <button onClick={() => handleEdit(c.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors">Save</button>
                            <button onClick={() => setEditId(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <span className="text-[11px] font-bold text-indigo-600">{c.authorName || 'User'}</span>
                                <span className="mx-1.5 text-slate-300">·</span>
                                <span className="text-[11px] text-slate-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
                                <p className="mt-1 text-sm text-slate-700">{c.text}</p>
                            </div>
                            {(c.authorName === currentUser || !c.authorName) && (
                                <div className="flex shrink-0 gap-1">
                                    <button onClick={() => { setEditId(c.id); setEditText(c.text); }}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-indigo-600 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => handleDelete(c.id)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div className="flex gap-2 pt-1">
                <input className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                    placeholder="Add a comment..." value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                <button onClick={handleAdd} disabled={loading || !text.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}

function TicketCard({ ticket, onRefreshNotifications, isLoggedIn }) {
    const [expanded, setExpanded] = useState(false);
    const cat = CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-indigo-200">
            <div className={`h-1 w-full ${ticket.priority === 'CRITICAL' ? 'bg-rose-500' : ticket.priority === 'HIGH' ? 'bg-orange-400' : ticket.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#{ticket.id}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{cat}</span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 truncate">{ticket.resource}</h3>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" /> {ticket.location}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-2">{ticket.description}</p>

                {/* ── SLA TIMERS ── */}
                <SlaTimers ticket={ticket} />

                <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recently'}</span>
                        {ticket.assignedTo && <span className="flex items-center gap-1"><Wrench className="h-3 w-3 text-indigo-400" /><span className="text-indigo-600 font-semibold">{ticket.assignedTo}</span></span>}
                    </div>
                    <button onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                        {expanded ? <><ChevronUp className="h-3.5 w-3.5" /> Hide</> : <><ChevronDown className="h-3.5 w-3.5" /> Details & Comments</>}
                    </button>
                </div>

                {expanded && (
                    <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
                        {ticket.imageUrls?.length > 0 && (
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Evidence</p>
                                <div className="flex gap-2 flex-wrap">
                                    {ticket.imageUrls.map((url, i) => (
                                        <img key={i} src={resolveTicketImageUrl(url)} alt={`evidence-${i}`}
                                            className="h-24 w-24 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(resolveTicketImageUrl(url), '_blank')} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {ticket.resolutionNotes && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Resolution Notes</p>
                                <p className="text-sm text-emerald-800">{ticket.resolutionNotes}</p>
                            </div>
                        )}
                        {ticket.status === 'REJECTED' && ticket.rejectionReason && (
                            <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600 mb-1">Rejection Reason</p>
                                <p className="text-sm text-rose-800">{ticket.rejectionReason}</p>
                            </div>
                        )}
                        <CommentSection ticketId={ticket.id} onRefreshNotifications={onRefreshNotifications} isLoggedIn={isLoggedIn} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TicketingPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showMyTicketsOnly, setShowMyTicketsOnly] = useState(false);
    const requireAuth = useRequireAuth();
    const { refreshNotifications } = useNotificationRefresh();

    const isLoggedIn = !!localStorage.getItem('userId');
    const userId = localStorage.getItem('userId') || '';

    const sortTicketsNewestFirst = (items) => {
        return [...items].sort((a, b) => {
            const timeA = Date.parse(a?.createdAt || a?.updatedAt || '') || 0;
            const timeB = Date.parse(b?.createdAt || b?.updatedAt || '') || 0;
            return timeB - timeA;
        });
    };

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true); setError('');
            if (isLoggedIn && showMyTicketsOnly && userId) {
                const res = await getMyTickets(userId);
                setTickets(sortTicketsNewestFirst(Array.isArray(res.data) ? res.data : []));
            } else {
                const res = await getAllTickets();
                setTickets(sortTicketsNewestFirst(Array.isArray(res.data) ? res.data : []));
            }
        } catch (e) {
            console.error(e);
            setError('Could not load tickets. Make sure the backend is running.');
        } finally { setLoading(false); }
    }, [isLoggedIn, showMyTicketsOnly, userId]);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const handleNewTicket = () => { requireAuth(() => setShowCreate(true)); };

    const filtered = filterStatus === 'ALL' ? tickets : tickets.filter(t => t.status === filterStatus);
    const statusCounts = ['ALL', ...Object.keys(STATUSES)].reduce((acc, s) => {
        acc[s] = s === 'ALL' ? tickets.length : tickets.filter(t => t.status === s).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <UserHeader />
            <div className="mx-auto max-w-5xl px-6 py-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">
                            {isLoggedIn && showMyTicketsOnly ? 'My Tickets' : 'All Tickets'}
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {isLoggedIn && showMyTicketsOnly
                                ? 'Track your reported incidents and maintenance requests'
                                : 'Browse all tickets from the campus community'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLoggedIn && (
                            <button onClick={() => setShowMyTicketsOnly(!showMyTicketsOnly)}
                                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${showMyTicketsOnly
                                    ? 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                {showMyTicketsOnly ? 'View All' : 'My Tickets'}
                            </button>
                        )}
                        <button onClick={fetchTickets} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
                            <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleNewTicket}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 transition-all">
                            <Plus className="h-4 w-4" /> New Ticket
                        </button>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {['ALL', ...Object.keys(STATUSES)].map(s => {
                        const info = s === 'ALL' ? null : STATUSES[s];
                        return (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`rounded-2xl border p-3 text-center transition-all ${filterStatus === s ? 'border-indigo-300 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50'}`}>
                                <div className={`text-2xl font-black ${filterStatus === s ? 'text-indigo-600' : 'text-slate-800'}`}>{statusCounts[s]}</div>
                                <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${filterStatus === s ? 'text-indigo-500' : 'text-slate-400'}`}>
                                    {s === 'ALL' ? 'All' : info?.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />{error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                        <p className="text-sm font-medium">Loading your tickets...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No tickets found</h3>
                        <p className="mt-1 text-sm text-slate-400">
                            {filterStatus === 'ALL' ? 'Submit your first ticket using the button above.' : `No ${STATUSES[filterStatus]?.label} tickets.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(t => <TicketCard key={t.id} ticket={t} onRefreshNotifications={refreshNotifications} isLoggedIn={isLoggedIn} />)}
                    </div>
                )}
            </div>

            {showCreate && (
                <CreateTicketModal
                    onClose={() => setShowCreate(false)}
                    onCreated={() => { setShowCreate(false); fetchTickets(); refreshNotifications(); }}
                />
            )}
        </div>
    );
}