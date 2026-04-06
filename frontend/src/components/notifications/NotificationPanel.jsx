// src/components/notifications/NotificationPanel.jsx
import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import notificationService from '../../services/notificationService';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    notificationService.getMyNotifications()
      .then(setNotifications)
      .catch(err => {
        console.error('Failed to load notifications:', err);
        setNotifications([]);
      });
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <button 
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-300 transition-all hover:bg-white/10 hover:text-white shadow-sm"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#241571]"></span>
        )}
      </button>

      {open && (
        <div>
          {notifications.length === 0 && <p>No notifications</p>}
          {notifications.map(n => (
            <div key={n.id} style={{ fontWeight: n.isRead ? 'normal' : 'bold' }}>
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;