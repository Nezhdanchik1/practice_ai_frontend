import api from './axios';

// ✅ Создать BBoxes
export const createBBoxes = async (bboxes) => {
  return api.post('/api/bboxes/', bboxes);
};

// ✅ Получить BBoxes для экзамена
export const fetchBBoxesByExam = async (examId) => {
  const response = await api.get(`/api/bboxes/list/${examId}`);
  return response.data;
};

// ✅ Удалить один BBox по его id
export const deleteBBox = async (id) => {
  return api.delete(`/api/bboxes/${id}`);
};
