import axios from '../axios';

export const getAllFacilities = () => {
    return axios.get('/api/facilities/all');
};

export const getFeaturedFacilities = () => {
    return axios.get('/api/facilities/featured');
};

export const getFacilityById = (id) => {
    return axios.get(`/api/facilities/${id}`);
};

export const searchFacilities = (params) => {
    return axios.get('/api/facilities/search', { params });
};

export const getFilterOptions = () => {
    return axios.get('/api/facilities/filter-options');
};

export const createFacility = (data) => {
    return axios.post('/api/facilities/create', data);
};

export const updateFacility = (id, data) => {
    return axios.put(`/api/facilities/update/${id}`, data);
};

export const deleteFacility = (id) => {
    return axios.delete(`/api/facilities/delete/${id}`);
}; 