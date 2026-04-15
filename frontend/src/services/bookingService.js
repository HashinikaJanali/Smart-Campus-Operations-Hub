import axios from 'axios';

const API_URL = 'http://localhost:8085/api/bookings';

export const getAllBookings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getBookingsByUser = async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
};

export const updateBookingStatus = async (id, status, reason) => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status, reason });
    return response.data;
};

export const cancelBooking = async (id, userId) => {
    let url = `${API_URL}/${id}/cancel`;
    if (userId) {
        url += `?userId=${userId}`;
    }
    const response = await axios.put(url);
    return response.data;
};

export const checkInBooking = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/checkin`);
    return response.data;
};
