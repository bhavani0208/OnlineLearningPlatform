import API from './api';

export const getCoursesAPI = (params) => API.get('/courses', { params });
export const getCourseByIdAPI = (id) => API.get(`/courses/${id}`);
export const createCourseAPI = (data) => API.post('/courses', data);
export const updateCourseAPI = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourseAPI = (id) => API.delete(`/courses/${id}`);
export const getInstructorCoursesAPI = () => API.get('/courses/instructor/my-courses');
export const createSectionAPI = (courseId, data) => API.post(`/courses/${courseId}/sections`, data);
export const createLessonAPI = (sectionId, data) => API.post(`/sections/${sectionId}/lessons`, data);
export const getCategoriesAPI = () => API.get('/categories');
