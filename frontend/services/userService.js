// frontend/services/userService.js
import api from './api';

const userService = {
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },

  getById: (id) => {
    return api.get(`/users/${id}`);
  },

  create: (userData) => {
    return api.post('/users', userData);
  },

  update: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  delete: (id) => {
    return api.delete(`/users/${id}`);
  },
};

export default userService;