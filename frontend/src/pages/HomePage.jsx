import React from 'react';
import { NavLink } from 'react-router-dom';
import UserHeader from '../components/common/UserHeader';
import heroImage from '../assets/hero_image.png';
import logo from '../assets/logo.png';
import {
    ArrowRight,
    ShieldCheck,
    Zap,
    Clock,
    Users,
    Building2,
    FlaskConical,
    MonitorPlay,
    CheckCircle2,
    Search,
    BookOpen,
    Lightbulb
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <UserHeader />

            {/* ── HERO SECTION ── */}
            <section className="relative overflow-hidden py-20 lg:py-28">
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white" />
                
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-indigo-200/40 to-transparent blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute -bottom-20 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-100/30 to-transparent blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 mx-auto max-w-7xl px-8 sm:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-24">
                        {/* Content */}
                        <div className="flex-1 lg:max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                            {/* Badge */}
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-indigo-100/50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-indigo-700 shadow-sm backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                Unified Campus Management
                            </div>
                            
                            {/* Headline */}
                            <h1 className="mb-6 text-5xl font-black leading-[1.15] text-slate-900 lg:text-7xl tracking-tight">
                                Empower Your <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Campus Operations</span>
                            </h1>
                            
                            {/* Subheading */}
                            <p className="mb-10 text-lg font-medium text-slate-600 leading-relaxed lg:text-xl max-w-lg">
                                A modern, integrated platform designed for students, lecturers, and staff. Manage bookings, track issues, and monitor campus operations—all in one place.
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <NavLink
                                    to="/resoursestudent"
                                    className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-10 py-4 text-base font-black text-white shadow-2xl shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95"
                                >
                                    <span>Explore Platform</span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </NavLink>
                                <button
                                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-10 py-4 text-base font-black text-slate-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-95 shadow-md hover:shadow-lg"
                                >
                                    <span>Learn More</span>
                                </button>
                            </div>
                            
                            {/* Trust indicators */}
                            <div className="mt-12 flex items-center gap-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">3,500+ Active Users</p>
                                    <p className="text-xs font-medium text-slate-500">Across campus</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000">
                            {/* Decorative elements */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-300/20 rounded-3xl blur-3xl" />
                            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-300/10 rounded-3xl blur-3xl" />
                            
                            {/* Image container */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-indigo-400/10 to-blue-500/20 rounded-[3.5rem] blur-2xl" />
                                <img 
                                    src={heroImage} 
                                    alt="Campus Operations Hub" 
                                    className="relative rounded-[3rem] shadow-2xl border border-white/60 object-cover w-full h-[500px] backdrop-blur-md"
                                />
                                
                                {/* Feature badges */}
                                <div className="absolute bottom-6 left-6 right-6 flex gap-3 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/40">
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-wider">Real-time</p>
                                        <p className="text-sm font-bold text-slate-800">Updates</p>
                                    </div>
                                    <div className="w-px bg-slate-200" />
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-wider">24/7</p>
                                        <p className="text-sm font-bold text-slate-800">Available</p>
                                    </div>
                                </div>
                            </div>
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
                                title: "Smart Bookings",
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

            {/* ── HOW IT WORKS ── */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-7xl px-8 sm:px-12">
                    <div className="mb-12 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">How It Works</h2>
                        <h3 className="text-base font-bold text-indigo-600 uppercase tracking-[0.2em]">Simple Steps to Streamline Your Campus Experience</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Sign In",
                                desc: "Log in with your campus credentials to access your personalized dashboard and all platform features.",
                                icon: ShieldCheck,
                                color: "from-indigo-600 to-indigo-500"
                            },
                            {
                                step: "02",
                                title: "Explore Resources",
                                desc: "Browse available labs, lecture halls, and equipment with real-time availability and instant booking.",
                                icon: Search,
                                color: "from-blue-600 to-indigo-600"
                            },
                            {
                                step: "03",
                                title: "Book & Manage",
                                desc: "Reserve resources, track your bookings, and manage approvals all in one centralized hub.",
                                icon: BookOpen,
                                color: "from-emerald-600 to-blue-600"
                            },
                            {
                                step: "04",
                                title: "Report & Track",
                                desc: "Submit support tickets for issues and monitor their status until resolution in real-time.",
                                icon: Lightbulb,
                                color: "from-amber-600 to-emerald-600"
                            }
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className={`group relative animate-in fade-in slide-in-from-bottom-12 duration-700`} style={{ animationDelay: `${i * 100}ms` }}>
                                    {/* Connector line */}
                                    {i < 3 && (
                                        <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%+24px)] h-1 bg-gradient-to-r from-indigo-300 to-transparent pointer-events-none" />
                                    )}
                                    
                                    <div className="relative h-full rounded-3xl border border-indigo-100/50 bg-gradient-to-br from-indigo-50/30 to-white p-8 shadow-sm shadow-indigo-100/20 transition-all duration-500 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-200/30 hover:-translate-y-2">
                                        <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white font-black text-xl shadow-lg shadow-indigo-200/40 group-hover:scale-110 transition-transform duration-500`}>
                                            {item.step}
                                        </div>
                                        <h4 className="mb-3 text-xl font-black text-slate-800">{item.title}</h4>
                                        <p className="text-sm font-medium leading-relaxed text-slate-500">
                                            {item.desc}
                                        </p>
                                    </div>
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
                            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
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
