import api from './axios';

export const getAnswersByExam = (examId) =>
  api.get(`/answers/exam/${examId}`).then((res) => res.data);

export const getAnswerById = async (answerId) => {
  const res = await api.get(`/answers/${answerId}`);
  return res.data;
};

export const getAnswerImagesById = async (answerId) => {
  const res = await api.get(`/answers/images/${answerId}`);
  return res.data;
};

export const uploadAnswer = (file, examId) => {
  const formData = new FormData();
  formData.append('file', file); // ✅ файл, как multipart
  return api.post(`/answers/upload?exam_id=${examId}`, formData); // ✅ exam_id в query
};

export const uploadZipAnswers = async (file, examId) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/answers/upload_zip?exam_id=${examId}`, formData);
};

export const updateAnswerGrade = (id, grade) =>
  api.put(`/answers/${id}/grade`, { grade });

export const deleteAnswer = (id) =>
  api.delete(`/answers/${id}`);
