const API_URL = 'http://localhost:8085/api/notifications';

const notificationService = {
  getMyNotifications: async () => {
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      if (!res.ok) {
        console.warn('Notifications API returned:', res.status);
        return [];
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  getCurrentUserInfo: async () => {
    try {
      const res = await fetch(`${API_URL}/debug/current-user`, { 
        credentials: 'include' 
      });
      if (!res.ok) {
        console.warn('Current user API returned:', res.status);
        return null;
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  markAsRead: async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/read`, {
        method: 'PATCH', credentials: 'include'
      });
      return res.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {};
    }
  },
  markAllAsRead: async () => {
    try {
      const res = await fetch(`${API_URL}/read-all`, {
        method: 'PATCH', credentials: 'include'
      });
      return res.json();
    } catch (error) {
      console.error('Error marking all as read:', error);
      return {};
    }
  },
  deleteNotification: async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE', credentials: 'include'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },
  createTestNotification: async () => {
    try {
      const res = await fetch(`${API_URL}/test`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        console.error('Test notification failed:', res.status);
        return null;
      }
      return res.json();
    } catch (error) {
      console.error('Error creating test notification:', error);
      return null;
    }
  },
  getSettings: async () => {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        credentials: 'include'
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
  },
  saveSettings: async (settings) => {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return null;
    }
  },
  getUnreadCount: async () => {
    try {
      const res = await fetch(`${API_URL}/unread-count`, {
        credentials: 'include'
      });
      if (!res.ok) return 0;
      const data = await res.json();
      return data.count ?? 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }
};

export default notificationService;
