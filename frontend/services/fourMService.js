// frontend/services/fourMService.js
import api from './api';

const fourMService = {
  getAll: (params = {}) => {
    return api.get('/fourm', { params });
  },

  getById: (id) => {
    return api.get(`/fourm/${id}`);
  },

  create: (data) => {
    return api.post('/fourm', data);
  },

  update: (id, data) => {
    return api.put(`/fourm/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/fourm/${id}`);
  },
};

export default fourMService;