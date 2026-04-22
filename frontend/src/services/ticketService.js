import axios from 'axios';

const API_BASE = 'http://localhost:8085/api';
const FILE_BASE = 'http://localhost:8085';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const getAllTickets = () => api.get('/tickets');

export const getMyTickets = (userId) =>
    api.get('/tickets/my', { params: userId ? { userId } : {} });

export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const createTicket = (formData) =>
    api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updateTicketStatus = (id, payload) =>
    api.patch(`/tickets/${id}/status`, payload);

export const assignTicket = (id, technicianName) =>
    api.patch(`/tickets/${id}/assign`, { assignedTo: technicianName });

export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

export const getComments = (ticketId) => api.get(`/tickets/${ticketId}/comments`);

export const addComment = (ticketId, text, authorName) =>
    api.post(`/tickets/${ticketId}/comments`, { text, authorName });

export const editComment = (ticketId, commentId, text, requestingUser) =>
    api.put(`/tickets/${ticketId}/comments/${commentId}`, { text, requestingUser });

export const deleteComment = (ticketId, commentId, requestingUser) =>
    api.delete(`/tickets/${ticketId}/comments/${commentId}`, {
        params: { requestingUser }
    });

export const resolveTicketImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${FILE_BASE}${url.startsWith('/') ? url : `/${url}`}`;
};
