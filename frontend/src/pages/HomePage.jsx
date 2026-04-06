import React from 'react';
import { NavLink } from 'react-router-dom';
import UserHeader from '../components/common/UserHeader';
import heroImage from '../assets/hero_image.png';
import {
    LayoutDashboard,
    ArrowRight,
    ShieldCheck,
    Zap,
    Clock,
    Users,
    Building2,
    FlaskConical,
    MonitorPlay
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <UserHeader />

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden bg-white py-16 lg:py-20">
                {/* Subtle decorative background blurs */}
                <div className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-50/50 blur-[80px] pointer-events-none" />

                <div className="relative z-10 mx-auto max-w-7xl px-8 sm:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 lg:max-w-2xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                Next-Gen Campus Hub
                            </div>
                            <h1 className="mb-6 text-4xl font-black leading-tight text-slate-900 lg:text-6xl">
                                Campus Operations,<br />
                                <span className="text-indigo-600">Simplified & Unified</span>
                            </h1>
                            <p className="mb-8 text-base font-medium text-slate-500 leading-relaxed md:text-lg">
                                Empowering Students, Lecturers, and Staff with a state-of-the-art platform for resource reservation, issue tracking, and real-time operations management.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <NavLink
                                    to="/resoursestudent"
                                    className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
                                >
                                    Explore Resources <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </NavLink>
                                <button
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
                                >
                                    Get Support
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:block flex-1 relative animate-in fade-in zoom-in duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-[3rem] blur-2xl" />
                            <img src={heroImage} alt="Campus Hub" className="relative rounded-[2.5rem] shadow-2xl border-4 border-white shadow-indigo-200 object-cover w-full h-[450px]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ── */}
            <section className="py-12 bg-indigo-100/40 border-y border-indigo-200/50">
                <div className="mx-auto max-w-7xl px-8 sm:px-12">
                    <div className="mb-8 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">Core Services</h2>
                        <h3 className="text-base font-bold text-indigo-600 uppercase tracking-[0.2em]">Everything You Need To Navigate Campus</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Smart Reservations",
                                desc: "Instantly check availability and book lecture halls or labs with real-time approvals and schedules.",
                                icon: Zap,
                                color: "text-indigo-600",
                                bg: "bg-indigo-50",
                                delay: "duration-500"
                            },
                            {
                                title: "Integrated Ticket System",
                                desc: "Report technical issues or facility maintenance needs and track them until resolution in real-time.",
                                icon: ShieldCheck,
                                color: "text-indigo-600",
                                bg: "bg-indigo-50",
                                delay: "duration-700"
                            },
                            {
                                title: "24/7 Operations Hub",
                                desc: "Live monitoring of campus facilities to ensure seamless service delivery for all campus stakeholders.",
                                icon: Clock,
                                color: "text-indigo-600",
                                bg: "bg-indigo-50",
                                delay: "duration-1000"
                            }
                        ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className={`group rounded-3xl border border-indigo-100 bg-white p-10 shadow-sm shadow-indigo-100/40 transition-all duration-700 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-12 ${f.delay}`}>
                                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-inset ring-black/5 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <Icon className="h-7 w-7 transition-colors duration-500" />
                                    </div>
                                    <h4 className="mb-3 text-xl font-black text-slate-800">{f.title}</h4>
                                    <p className="text-sm font-medium leading-relaxed text-slate-500">
                                        {f.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── STATS SECTION ── */}
            <section className="bg-white py-12 border-b border-slate-100">
                <div className="mx-auto max-w-7xl px-8 text-center mb-10 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">Resource Overview</h2>
                    <h3 className="text-base font-bold text-indigo-600 uppercase tracking-[0.2em]">Our Campus Impact</h3>
                </div>
                <div className="mx-auto max-w-7xl px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 bg-indigo-50/50 border border-indigo-100/50 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20 animate-in zoom-in duration-1000">
                        {[
                            { val: "12k+", lbl: "Resources", icon: Building2 },
                            { val: "500+", lbl: "Labs/Halls", icon: FlaskConical },
                            { val: "3.5k+", lbl: "Active Users", icon: Users },
                            { val: "1.2k+", lbl: "Equipment", icon: MonitorPlay }
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 text-center">
                                    <div className="mb-1 rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="text-4xl font-black text-slate-900 tracking-tight">{s.val}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600/70">{s.lbl}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CALL TO ACTION ── */}
            <section className="py-14 bg-indigo-100/40 border-y border-indigo-200/50 animate-in fade-in duration-1000">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="group text-center rounded-[3rem] bg-gradient-to-br from-black via-slate-900 to-indigo-900 p-12 sm:p-16 shadow-2xl relative overflow-hidden ring-1 ring-white/10 transition-all duration-700 hover:shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 h-96 w-96 bg-indigo-500/20 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-500/10 blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <h2 className="text-4xl font-black text-white sm:text-5xl mb-6 leading-tight tracking-tight">
                                Ready to simplify your <br /> <span className="text-indigo-400">Campus Operations?</span>
                            </h2>
                            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium text-lg italic">
                                "The Hub is designed to unify every aspect of campus management, so you can focus on what matters most for lecturing and learning."
                            </p>
                            <div className="flex justify-center">
                                <NavLink
                                    to="/resoursestudent"
                                    className="group/btn flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-5 text-base font-black text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    Get Started Now <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-slate-50 py-10 border-t border-slate-100">
                <div className="mx-auto max-w-7xl px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 shadow-sm border border-indigo-100 overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-800">
                            Uni<span className="text-indigo-600">Ops</span>
                        </span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        © 2026 Smart Campus Operations Hub
                    </p>
                </div>
            </footer>
        </div>
    );
}
