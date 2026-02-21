import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const accountAPI = {
  deposit: (amount) => api.post('/account/deposit', { amount }),
  withdraw: (amount) => api.post('/account/withdraw', { amount }),
  transfer: (recipientEmailOrAccount, amount) =>
    api.post('/account/transfer', { recipientEmailOrAccount, amount }),
  getTransactions: () => api.get('/account/transactions'),
  getProfile: () => api.get('/account/profile'),
  updateProfile: (data) => api.put('/account/profile', data),
  changePassword: (data) => api.put('/account/change-password', data),
};

export default api;
