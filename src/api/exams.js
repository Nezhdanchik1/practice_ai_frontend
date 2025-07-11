import api from './axios';

export async function fetchExams() {
  const res = await api.get("/exams");
  return res.data;
}

export async function createExam(exam) {
  const res = await api.post("/exams", exam);
  return res.data;
}

export async function deleteExam(id) {
  await api.delete(`${"/exams"}/${id}`);
}
