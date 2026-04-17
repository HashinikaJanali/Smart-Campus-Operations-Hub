import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { Users, Search, Loader2, ShieldCheck, UserCheck, Wrench } from 'lucide-react';

export default function AdminUserManagementPage() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8085/api/users', {
                credentials: 'include'
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
                setFiltered(data);
            } else {
                console.error('API did not return an array of users:', data);
                setUsers([]);
                setFiltered([]);
            }
        } catch (error) {
            console.error('Error loading users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        setFiltered(users.filter(u =>
            u.name.toLowerCase().includes(val.toLowerCase()) ||
            u.email.toLowerCase().includes(val.toLowerCase())
        ));
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingId(userId);
            await fetch(`http://localhost:8085/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ role: newRole })
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            setFiltered(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    const getRoleConfig = (role) => {
        switch (role) {
            case 'ADMIN': return { icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
            case 'TECHNICIAN': return { icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
            default: return { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* ── ADMIN SIDEBAR ── */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activePage="users"
            />

            {/* ── MAIN ── */}
            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 italic">
                        User <span className="text-indigo-600">Management</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Manage user roles and access levels.
                    </p>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={handleSearch}
                        className="bg-transparent border-none text-slate-800 focus:outline-none w-full placeholder-slate-400 text-sm font-medium"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Users', value: users.length, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
                        { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Technicians', value: users.filter(u => u.role === 'TECHNICIAN').length, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                                    <Icon className={`w-5 h-5 ${s.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Users Table */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Current Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Change Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(user => {
                                    const rc = getRoleConfig(user.role);
                                    const RoleIcon = rc.icon;
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-black text-indigo-600">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-800">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${rc.bg} ${rc.color} ${rc.border}`}>
                                                    <RoleIcon className="w-3 h-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={updatingId === user.id}
                                                    className="text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all disabled:opacity-50"
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="TECHNICIAN">TECHNICIAN</option>
                                                </select>
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
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}