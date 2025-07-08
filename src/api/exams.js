import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1/exams';

export async function fetchExams() {
  const res = await axios.get(API_BASE);
  return res.data;
}

export async function createExam(exam) {
  const res = await axios.post(API_BASE, exam);
  return res.data;
}

export async function deleteExam(id) {
  await axios.delete(`${API_BASE}/${id}`);
}
