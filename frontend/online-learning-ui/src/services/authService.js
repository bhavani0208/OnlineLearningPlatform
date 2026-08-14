import API from './api';

export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMeAPI = () => API.get('/auth/me');
