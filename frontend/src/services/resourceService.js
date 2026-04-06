import axios from 'axios';

const API_URL = "http://localhost:8085/api/resources";

// GET ALL
export const getAllResources = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

// GET BY ID
export const getResourceById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

// GET BY TYPE
export const getResourcesByType = async (type) => {
    const response = await axios.get(`${API_URL}/type/${type}`);
    return response.data;
}

// GET BY STATUS
export const getResourcesByStatus = async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`);
    return response.data;
}

// POST - ADD
export const addResource = async (resource) => {
    const response = await axios.post(API_URL, resource);
    return response.data;
}

// PUT - UPDATE
export const updateResource = async (id, resource) => {
    const response = await axios.put(`${API_URL}/${id}`, resource);
    return response.data;
}

// DELETE
export const deleteResource = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
}