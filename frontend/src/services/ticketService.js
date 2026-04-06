import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getAllTickets = () => api.get('/tickets');
export const getMyTickets = () => api.get('/tickets/my');
export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const createTicket = (formData) =>
    api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updateTicketStatus = (id, payload) =>
    api.patch(`/tickets/${id}/status`, payload);

export const assignTicket = (id, technicianName) =>
    api.patch(`/tickets/${id}/assign`, { assignedTo: technicianName });

export const getComments = (ticketId) => api.get(`/tickets/${ticketId}/comments`);
export const addComment = (ticketId, text) =>
    api.post(`/tickets/${ticketId}/comments`, { text });
export const editComment = (ticketId, commentId, text) =>
    api.put(`/tickets/${ticketId}/comments/${commentId}`, { text });
export const deleteComment = (ticketId, commentId) =>
    api.delete(`/tickets/${ticketId}/comments/${commentId}`);