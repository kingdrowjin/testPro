// frontend/services/yamazumiService.js
import api from './api';

const yamazumiService = {
  getAll: (params = {}) => {
    return api.get('/yamazumi', { params });
  },

  getById: (id) => {
    return api.get(`/yamazumi/${id}`);
  },

  create: (data) => {
    return api.post('/yamazumi', data);
  },

  update: (id, data) => {
    return api.put(`/yamazumi/${id}`, data);
  },

  delete: (id) => {
    return api.delete(`/yamazumi/${id}`);
  },
};

export default yamazumiService;