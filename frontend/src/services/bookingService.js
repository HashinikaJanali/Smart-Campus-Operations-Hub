import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const getAllBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

export const getBookingsByUser = async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const updateBookingStatus = async (id, status, reason) => {
    const response = await api.put(`/bookings/${id}/status`, { status, reason });
    return response.data;
};

export const cancelBooking = async (id, userId) => {
    let url = `/bookings/${id}/cancel`;
    if (userId) {
        url += `?userId=${userId}`;
    }
    const response = await api.put(url);
    return response.data;
};

export const checkInBooking = async (id) => {
    const response = await api.post(`/bookings/${id}/checkin`);
    return response.data;
};
