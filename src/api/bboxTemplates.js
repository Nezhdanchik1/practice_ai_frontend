import api from './axios';

// Создать шаблон
export const createBBoxTemplate = async (payload) => {
  return api.post('/api/bboxes/template', payload);
};

// Получить шаблоны по экзамену
export const fetchBBoxTemplatesByExam = async (examId) => {
  const res = await api.get(`/api/bboxes/template/list/${examId}`);
  return res.data;
};

// Удалить шаблон
export const deleteBBoxTemplate = async (id) => {
  return api.delete(`/api/bboxes/template/${id}`);
};

// Применить шаблон (crop)
export const applyBBoxTemplate = async (examId, bboxes) => {
  return api.post(`/api/v1/crop/manual/${examId}`, bboxes);
};
