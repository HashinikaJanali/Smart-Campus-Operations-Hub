import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const getSummaryStats = async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
};

export const getTopResources = async () => {
    const response = await api.get('/analytics/top-resources');
    return response.data;
};

export const getPeakHours = async () => {
    const response = await api.get('/analytics/peak-hours');
    return response.data;
};
