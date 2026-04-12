import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area 
} from 'recharts';
import { LayoutDashboard, Users, Clock, Activity, Loader2, ArrowUpRight } from 'lucide-react';
import { getSummaryStats, getTopResources, getPeakHours } from '../services/analyticsService';

export default function AdminDashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalResources: 0,
        activeResources: 0,
        totalBookings: 0,
        avgUtilization: '0%'
    });
    
    const [topResources, setTopResources] = useState([]);
    const [peakHoursData, setPeakHoursData] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Fetch all statistics in parallel
            const [summary, top, peak] = await Promise.all([
                getSummaryStats(),
                getTopResources(),
                getPeakHours()
            ]);

            setStats({
                totalResources: summary.totalResources,
                activeResources: summary.activeResources,
                totalBookings: summary.totalBookings,
                avgUtilization: summary.avgUtilization
            });

            setTopResources(top);
            setPeakHoursData(peak);

        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* ── SHARED ADMIN SIDEBAR ── */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
                activePage="dashboard"
            />

            {/* ── MAIN ── */}
            <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>
                
                {/* ── HEADER ── */}
                <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                            <Activity className="w-3.5 h-3.5" /> Live Analytics
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            Platform <span className="text-indigo-600">Overview</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            Real-time usage statistics and resource insights.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="mt-4 text-sm font-medium text-slate-500">Loading analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* ── TOP STATS GRID ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {[
                                { lbl: 'Total Resources', val: stats.totalResources, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
                                { lbl: 'Active Resources', val: stats.activeResources, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Healthy' },
                                { lbl: 'Total Bookings', val: stats.totalBookings, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+24%' },
                                { lbl: 'Avg Utilization', val: stats.avgUtilization, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+5%' },
                            ].map((s, i) => {
                                const Icon = s.icon;
                                return (
                                    <div key={i} className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-indigo-100/50 transition-all hover:shadow-md hover:-translate-y-1`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                {s.trend} <ArrowUpRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.lbl}</h3>
                                            <p className="text-3xl font-black text-slate-900 tracking-tight">{s.val}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── CHARTS SECTION ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            
                            {/* Top Resources Bar Chart */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-indigo-100/50">
                                <h3 className="text-lg font-black text-slate-900 mb-6">Top Reserved Resources</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topResources} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            />
                                            <Tooltip 
                                                cursor={{ fill: '#f8fafc' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="reservations" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Peak Hours Area Chart */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-indigo-100/50">
                                <h3 className="text-lg font-black text-slate-900 mb-6">Peak Booking Hours</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="time" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
