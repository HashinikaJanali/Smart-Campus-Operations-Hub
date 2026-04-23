import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        // Normalize: backend may return an object e.g. { error: "..." } or { message: "..." }
        let text = message;
        if (typeof text === 'object' && text !== null) {
            text = text.message || text.error || text.detail || JSON.stringify(text);
        }
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message: String(text), type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const STYLES = {
        success: {
            container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
            bar: 'bg-emerald-500',
        },
        error: {
            container: 'bg-rose-50 border-rose-200 text-rose-800',
            icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
            bar: 'bg-rose-500',
        },
        info: {
            container: 'bg-indigo-50 border-indigo-200 text-indigo-800',
            icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
            bar: 'bg-indigo-500',
        },
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => {
                    const s = STYLES[toast.type] || STYLES.info;
                    return (
                        <div
                            key={toast.id}
                            className={`
                                pointer-events-auto relative overflow-hidden
                                flex items-start gap-3
                                rounded-2xl border shadow-xl shadow-slate-900/10
                                px-4 py-3 pr-10 min-w-[300px] max-w-sm
                                backdrop-blur-md
                                animate-in slide-in-from-right-4 fade-in duration-300
                                ${s.container}
                            `}
                        >
                            {s.icon}
                            <span className="text-sm font-semibold leading-snug">{toast.message}</span>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="absolute top-2.5 right-2.5 p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                            {/* Progress bar */}
                            <span
                                className={`absolute bottom-0 left-0 h-[3px] ${s.bar} rounded-full`}
                                style={{ animation: 'toast-shrink 4s linear forwards' }}
                            />
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes toast-shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}
