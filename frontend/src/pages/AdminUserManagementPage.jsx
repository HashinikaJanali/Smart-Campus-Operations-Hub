import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import {
    Users, Search, Loader2, ShieldCheck, UserCheck, Wrench,
    CheckCircle2, XCircle, UserCog, Trash2
} from 'lucide-react';

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN'];

const roleConfig = {
    ADMIN:      { icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    TECHNICIAN: { icon: Wrench,      color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
    USER:       { icon: UserCheck,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold animate-in slide-in-from-bottom-4 duration-300 ${
            type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
            {type === 'success'
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <XCircle className="w-4 h-4 shrink-0" />}
            {message}
        </div>
    );
}

export default function AdminUserManagementPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8085/api/users', {
                credentials: 'include'
            });
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setUsers(list);
            setFiltered(list);
        } catch {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        const q = val.toLowerCase();
        setFiltered(users.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        ));
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingId(userId);
            const res = await fetch(`http://localhost:8085/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: newRole })
            });
            if (!res.ok) throw new Error();
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setFiltered(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showToast('Role updated successfully');
        } catch {
            showToast('Failed to update role', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }
        try {
            setUpdatingId(userId);
            const res = await fetch(`http://localhost:8085/api/users/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error();
            setUsers(prev => prev.filter(u => u.id !== userId));
            setFiltered(prev => prev.filter(u => u.id !== userId));
            showToast('User deleted successfully');
        } catch {
            showToast('Failed to delete user', 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const stats = [
        { label: 'Total Users',   value: users.length,                                       icon: Users,      color: 'text-blue-600',    bg: 'bg-blue-50' },
        { label: 'Regular Users', value: users.filter(u => u.role === 'USER').length,        icon: UserCheck,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Admins',        value: users.filter(u => u.role === 'ADMIN').length,       icon: ShieldCheck, color: 'text-indigo-600',  bg: 'bg-indigo-50' },
        { label: 'Technicians',   value: users.filter(u => u.role === 'TECHNICIAN').length, icon: Wrench,     color: 'text-amber-600',   bg: 'bg-amber-50' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <AdminSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activePage="users"
            />

            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>

                {/* Header */}
                <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                            <UserCog className="w-3.5 h-3.5" /> User Management
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            Manage <span className="text-indigo-600">Users</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Assign roles and control access across the platform.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-indigo-100/50 hover:shadow-md hover:-translate-y-1 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</h3>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={handleSearch}
                        className="bg-transparent border-none text-slate-800 focus:outline-none w-full placeholder-slate-400 text-sm font-medium"
                    />
                    {search && (
                        <span className="text-xs font-bold text-slate-400">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="mt-4 text-sm font-medium text-slate-500">Loading users...</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">User</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Change Role</th>
                                    <th className="text-left px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(user => {
                                    const rc = roleConfig[user.role] ?? roleConfig.USER;
                                    const RoleIcon = rc.icon;
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-black text-indigo-600">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-800">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">{formatDate(user.createdAt)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${rc.bg} ${rc.color} ${rc.border}`}>
                                                    <RoleIcon className="w-3 h-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {updatingId === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                                ) : (
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all cursor-pointer"
                                                    >
                                                        {ROLES.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {updatingId === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                                                ) : (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors hover:scale-110"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Users className="w-12 h-12 mb-3 text-slate-300" />
                                <p className="font-bold text-slate-500">No users found</p>
                                {search && <p className="text-sm mt-1">Try a different search term</p>}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
