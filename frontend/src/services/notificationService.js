const API_URL = 'http://localhost:8085/api/notifications';

const notificationService = {
  getMyNotifications: async () => {
    const res = await fetch(API_URL, { credentials: 'include' });
    return res.json();
  },
  markAsRead: async (id) => {
    const res = await fetch(`${API_URL}/${id}/read`, {
      method: 'PATCH', credentials: 'include'
    });
    return res.json();
  },
  deleteNotification: async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE', credentials: 'include'
    });
  }
};

export default notificationService;