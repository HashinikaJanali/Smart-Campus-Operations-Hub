import React, { createContext, useCallback, useRef, useContext } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const refreshCallbackRef = useRef(null);

    const refreshNotifications = useCallback(() => {
        if (refreshCallbackRef.current) {
            refreshCallbackRef.current();
        }
    }, []);

    const setRefreshCallback = useCallback((callback) => {
        refreshCallbackRef.current = callback;
    }, []);

    return (
        <NotificationContext.Provider value={{ refreshNotifications, setRefreshCallback }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationRefresh() {
    const context = useContext(NotificationContext);
    // Return a safe object even if context is not available
    if (!context) {
        return {
            refreshNotifications: () => {},
            setRefreshCallback: () => {}
        };
    }
    return context;
}
