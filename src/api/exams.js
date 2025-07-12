// src/api/exams.js
import api from './axios';

export const fetchExams = () => api.get('/exams/').then(res => res.data);
export const createExam = (exam) => api.post('/exams/', exam);
export const getExamById = (id) => api.get(`/exams/${id}`).then(res => res.data);
export const deleteExam = (id) => api.delete(`/exams/${id}`);
