import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});
const API_URL = "http://localhost:8085/api/resources";

// GET ALL
export const getAllResources = async () => {
    const response = await api.get('/resources');
    return response.data;
}

// GET BY ID
export const getResourceById = async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
}

// GET BY TYPE
export const getResourcesByType = async (type) => {
    const response = await api.get(`/resources/type/${type}`);
    return response.data;
}

// GET BY STATUS
export const getResourcesByStatus = async (status) => {
    const response = await api.get(`/resources/status/${status}`);
    return response.data;
}

// GET BY LOCATION
export const getResourcesByLocation = async (location) => {
    const response = await api.get(`/resources/location/${location}`);
    return response.data;
}

// POST - ADD
export const addResource = async (resource) => {
    const response = await api.post('/resources', resource);
    return response.data;
}

// PUT - UPDATE
export const updateResource = async (id, resource) => {
    const response = await api.put(`/resources/${id}`, resource);
    return response.data;
}

// DELETE
export const deleteResource = async (id) => {
    await api.delete(`/resources/${id}`);
}