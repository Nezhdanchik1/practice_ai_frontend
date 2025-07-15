import api from './axios';

// /src/api/bboxTemplates.js
export const createBBoxTemplate = async (payload) => {
  return api.post('/api/bboxes/template', payload);
};


export const fetchBBoxTemplatesByExam = async (examId) => {
  const res = await api.get(`/api/bboxes/template/list/${examId}`);
  return res.data;
};

export const deleteBBoxTemplate = async (id) => {
  return api.delete(`/api/bboxes/template/${id}`);
};
