// src/pages/ExamDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, deleteExam } from '../api/exams';
import {
  getAnswersByExam,
  uploadAnswer,
  updateAnswerGrade,
  deleteAnswer
} from '../api/answers';
import { Button, Table, Form } from 'react-bootstrap';

const ExamDetailPage = () => {
  const { id: examId } = useParams(); // id из URL
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadExam();
    loadAnswers();
  }, []);

  const loadExam = async () => {
    try {
      const data = await getExamById(examId);
      // Если id вложен в gorm_._model, достаём его
      const realId = data?.['gorm_._model']?.ID || data?.id;
      setExam({ ...data, id: realId });
    } catch {
      alert('Ошибка при загрузке экзамена');
      navigate('/exams');
    }
  };

  const normalizePdfUrl = (url) => {
    if (!url) return '';
    return url.replace('http://minio:9000', 'http://localhost:9000');
  };

  const loadAnswers = async () => {
    try {
      const data = await getAnswersByExam(examId);

      if (!Array.isArray(data)) {
        setAnswers([]);
        return;
      }

      const normalized = data.map((a) => ({
        ...a,
        id: a?.['gorm_._model']?.ID || a.id,
        pdf_url: normalizePdfUrl(a.pdf_url), // 🧠 подменяем ссылку
      }));

      setAnswers(normalized);
    } catch (err) {
      console.error('Ошибка при загрузке ответов:', err);
      setAnswers([]);
      alert('Ошибка при загрузке ответов');
    }
  };

  const getFileName = (url) => {
    if (!url) return '';
    try {
      return decodeURIComponent(url.split('/').pop());
    } catch {
      return url;
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Выберите PDF-файл');

    try {
      await uploadAnswer(file, examId); // examId — из useParams
      alert('Файл успешно загружен');
      setFile(null);
      loadAnswers();
    } catch (err) {
      alert('Ошибка загрузки файла');
      console.error(err);
    }
  };

  const handleGradeChange = async (answerId, value) => {
    const grade = parseFloat(value);
    if (isNaN(grade)) return;

    try {
      await updateAnswerGrade(answerId, grade);
      // Не вызываем loadAnswers сразу — избегаем лишнего запроса
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerId ? { ...a, grade } : a))
      );
    } catch (err) {
      alert('Ошибка при обновлении оценки');
      console.error(err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Удалить ответ?')) return;

    try {
      await deleteAnswer(answerId);
      loadAnswers();
    } catch {
      alert('Ошибка при удалении ответа');
    }
  };

  const handleDeleteExam = async () => {
    if (!window.confirm('Удалить экзамен?')) return;

    try {
      await deleteExam(examId);
      alert('Экзамен удалён');
      navigate('/exams');
    } catch {
      alert('Ошибка при удалении экзамена');
    }
  };

  return (
    <div>
      <h3>Экзамен #{exam?.id} — {exam?.crn}</h3>
      <p><strong>Дата:</strong> {exam?.date}</p>

      <hr />

      <h5>Загрузка нового ответа</h5>
      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>
      <div className="d-flex gap-2 mb-3">
        <Button variant="primary" onClick={handleUpload}>
          📤 Загрузить PDF
        </Button>
        <Button
          variant="warning"
          onClick={() => navigate('/crop-template')}
        >
          ✂️ Создать шаблон обрезки
        </Button>
      </div>

      <hr />

      <h5>Загруженные ответы</h5>
      {answers.length === 0 ? (
        <p>Ответов пока нет.</p>
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Файл</th>
              <th>Оценка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.id}</td>
                <td>
                  <a
                    href={a.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    {getFileName(a.pdf_url)}
                  </a>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    value={a.grade ?? ''}
                    onChange={(e) => handleGradeChange(a.id, e.target.value)}
                    style={{ maxWidth: '100px' }}
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteAnswer(a.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <hr />
      <Button variant="danger" onClick={handleDeleteExam}>🗑 Удалить экзамен</Button>{' '}
      <Button variant="secondary" onClick={() => navigate('/exams')}>⬅ Назад</Button>
    </div>
  );
};

export default ExamDetailPage;
