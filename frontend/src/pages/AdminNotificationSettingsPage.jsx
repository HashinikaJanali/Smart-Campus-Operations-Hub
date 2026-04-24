import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/common/AdminSidebar';
import { Settings, Save, CheckCircle2, Calendar, Ticket, MessageCircle, Loader2 } from 'lucide-react';
import notificationService from '../services/notificationService';

const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            disabled ? 'opacity-50 cursor-not-allowed' :
            checked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 hover:bg-slate-400'
        }`}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-200 ${
                checked ? 'translate-x-7' : 'translate-x-1'
            }`}
        />
    </button>
);

const SettingRow = ({ icon: Icon, label, description, checked, onChange, disabled }) => (
    <div className={`flex items-center justify-between gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${
        disabled 
            ? 'opacity-50 bg-slate-50 border-slate-200' 
            : checked 
                ? 'bg-indigo-50 border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
    }`}>
        <div className="flex items-center gap-4 flex-1">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                disabled 
                    ? 'bg-slate-100 text-slate-400' 
                    : checked
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-600'
            }`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className={`font-bold text-sm leading-tight ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>{label}</p>
                <p className={`text-xs mt-1.5 leading-relaxed ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
            </div>
        </div>
        <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
);

export default function AdminNotificationSettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settings, setSettings] = useState({
        disableAll: false,
        bookingEnabled: true,
        ticketEnabled: true,
        commentEnabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await notificationService.getSettings();
                if (data) {
                    setSettings({
                        disableAll: data.disableAll ?? false,
                        bookingEnabled: data.bookingEnabled ?? true,
                        ticketEnabled: data.ticketEnabled ?? true,
                        commentEnabled: data.commentEnabled ?? true
                    });
                }
            } catch (error) {
                console.error('Error loading notification settings:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await notificationService.saveSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const set = (key) => (val) => setSettings(prev => ({ ...prev, [key]: val }));
    const allDisabled = settings.disableAll;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* ── SHARED ADMIN SIDEBAR ── */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)} 
                activePage="notifications"
            />

            {/* ── MAIN ── */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[265px]' : 'ml-20'}`}>
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                    <div className="p-8 flex justify-center">
                        <div className="w-full max-w-2xl">
                
                        {/* ── HEADER ── */}
                        <div className="mb-8">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 shadow-sm">
                                    <Settings className="w-3.5 h-3.5" /> Preferences
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 leading-tight">
                                    Notification <span className="text-indigo-600">Settings</span>
                                </h1>
                                <p className="text-slate-500 mt-2 font-medium">
                                    Customize which notifications you receive about bookings, tickets, and comments
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-32">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                            </div>
                        ) : (
                            <div className="max-w-3xl">
                                {/* Master Toggle Card */}
                                <div className="mb-10 rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-900">Disable All Notifications</h3>
                                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                                Turn off all notification types at once. When enabled, all individual notification settings below will be ignored.
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <ToggleSwitch
                                                checked={settings.disableAll}
                                                onChange={set('disableAll')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Individual Settings */}
                                <div className="mb-10">
                                    <div className="mb-5">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 px-2">
                                            📋 Notification Types
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <SettingRow
                                            icon={Calendar}
                                            label="Booking Notifications"
                                            description="Get notified when users request or make changes to bookings"
                                            checked={settings.bookingEnabled}
                                            onChange={set('bookingEnabled')}
                                            disabled={allDisabled}
                                        />
                                        
                                        <SettingRow
                                            icon={Ticket}
                                            label="Ticket Notifications"
                                            description="Get notified when users raise new tickets or their tickets are updated"
                                            checked={settings.ticketEnabled}
                                            onChange={set('ticketEnabled')}
                                            disabled={allDisabled}
                                        />
                                        
                                        <SettingRow
                                            icon={MessageCircle}
                                            label="Comment Notifications"
                                            description="Get notified when users add comments to tickets"
                                            checked={settings.commentEnabled}
                                            onChange={set('commentEnabled')}
                                            disabled={allDisabled}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                                            </>
                                        ) : saved ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" /> Saved
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5" /> Save Preferences
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Success Message */}
                                {saved && (
                                    <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 px-5 py-4 text-sm text-emerald-700 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                                        <CheckCircle2 className="h-5 w-5 shrink-0" /> Notification preferences saved successfully!
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
