import axios from 'axios';

const API_URL = 'http://localhost:8085/api/analytics';

export const getSummaryStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const getTopResources = async () => {
    const response = await axios.get(`${API_URL}/top-resources`);
    return response.data;
};

export const getPeakHours = async () => {
    const response = await axios.get(`${API_URL}/peak-hours`);
    return response.data;
};
