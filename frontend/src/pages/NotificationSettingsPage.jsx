import React, { useState, useEffect } from 'react';
import UserHeader from '../components/common/UserHeader';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import notificationService from '../services/notificationService';

const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            disabled ? 'opacity-40 cursor-not-allowed' :
            checked ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
    </button>
);

const SettingRow = ({ label, checked, onChange, disabled }) => (
    <div className={`flex items-center justify-between py-3 ${disabled ? 'opacity-50' : ''}`}>
        <span className={`text-sm font-bold ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>{label}</span>
        <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
);

export default function NotificationSettingsPage() {
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
        const load = async () => {
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
            } catch (err) {
                console.error('Error loading settings', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await notificationService.saveSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Error saving settings', err);
        } finally {
            setSaving(false);
        }
    };

    const set = (key) => (val) => setSettings(prev => ({ ...prev, [key]: val }));
    const allDisabled = settings.disableAll;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <UserHeader />
            <main className="mx-auto max-w-2xl px-6 py-10">

                {/* Page Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                        <Settings className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 italic">
                            Notification <span className="text-indigo-600">Preferences</span>
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">
                            Control which notifications you receive
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">

                        {/* Master toggle */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-black text-slate-900">Disable all notifications</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                        Turn off all notifications at once
                                    </p>
                                </div>
                                <ToggleSwitch
                                    checked={settings.disableAll}
                                    onChange={set('disableAll')}
                                    disabled={false}
                                />
                            </div>
                        </div>

                        {/* Booking Notifications */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                                Booking Notifications
                            </p>
                            <div className="divide-y divide-slate-100">
                                <SettingRow
                                    label="Booking approved notifications"
                                    checked={settings.bookingEnabled && !allDisabled}
                                    onChange={set('bookingEnabled')}
                                    disabled={allDisabled}
                                />
                                <SettingRow
                                    label="Booking rejected notifications"
                                    checked={settings.bookingEnabled && !allDisabled}
                                    onChange={set('bookingEnabled')}
                                    disabled={allDisabled}
                                />
                                <SettingRow
                                    label="Booking cancelled notifications"
                                    checked={settings.bookingEnabled && !allDisabled}
                                    onChange={set('bookingEnabled')}
                                    disabled={allDisabled}
                                />
                            </div>
                        </div>

                        {/* Ticket Notifications */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                                Ticket Notifications
                            </p>
                            <div className="divide-y divide-slate-100">
                                <SettingRow
                                    label="Ticket status change notifications"
                                    checked={settings.ticketEnabled && !allDisabled}
                                    onChange={set('ticketEnabled')}
                                    disabled={allDisabled}
                                />
                            </div>
                        </div>

                        {/* Comment Notifications */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3">
                                Comment Notifications
                            </p>
                            <div className="divide-y divide-slate-100">
                                <SettingRow
                                    label="New comment notifications"
                                    checked={settings.commentEnabled && !allDisabled}
                                    onChange={set('commentEnabled')}
                                    disabled={allDisabled}
                                />
                            </div>
                        </div>

                        {/* Save button */}
                        <div className="flex items-center justify-between pt-2">
                            {saved && (
                                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Settings saved!
                                </div>
                            )}
                            {!saved && <div />}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save settings'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
