// frontend/services/companyService.js
import api from './api';

const companyService = {
  getAll: (params = {}) => {
    return api.get('/companies', { params });
  },

  getById: (id) => {
    return api.get(`/companies/${id}`);
  },

  create: (companyData) => {
    return api.post('/companies', companyData);
  },

  update: (id, companyData) => {
    return api.put(`/companies/${id}`, companyData);
  },

  delete: (id) => {
    return api.delete(`/companies/${id}`);
  },
};

export default companyService;