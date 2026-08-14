import API from './api';

export const createOrderAPI = (courseId) => API.post('/payments/create-order', { courseId });
export const verifyPaymentAPI = (data) => API.post('/payments/verify', data);
export const getMyEnrollmentsAPI = () => API.get('/payments/my-enrollments');
