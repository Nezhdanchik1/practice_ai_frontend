// src/pages/UploadPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, deleteExam } from '../api/exams';
import { Button, Form } from 'react-bootstrap';
import axios from '../api/axios';

const UploadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadExam();
  }, []);

  const loadExam = async () => {
    try {
      const data = await getExamById(id);
      setExam(data);
    } catch {
      alert('Не удалось загрузить экзамен');
      navigate('/exams');
    }
  };

  const handleFileUpload = async () => {
    if (!file) return alert('Выберите файл');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', id);

    try {
      await axios.post('/answers/upload', formData);
      alert('Файл успешно загружен');
    } catch {
      alert('Ошибка при загрузке файла');
    }
  };

  const handleDeleteExam = async () => {
    if (window.confirm('Удалить экзамен?')) {
      try {
        await deleteExam(id);
        alert('Экзамен удалён');
        navigate('/exams');
      } catch {
        alert('Ошибка при удалении экзамена');
      }
    }
  };

  return (
    <div>
      <h3>Экзамен #{exam?.id} — {exam?.crn}</h3>
      <p><strong>Дата:</strong> {exam?.date}</p>

      <Form.Group className="mb-3">
        <Form.Label>Загрузите PDF с ответами</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleFileUpload}>
        📤 Загрузить файл
      </Button>{' '}
      <Button variant="danger" onClick={handleDeleteExam}>
        🗑 Удалить экзамен
      </Button>{' '}
      <Button variant="secondary" onClick={() => navigate('/exams')}>
        ⬅ Назад
      </Button>
    </div>
  );
};

export default UploadPage;
