// src/pages/ExamsPage.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchExams, createExam } from '../api/exams';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({ crn: '', date: '' });
  const navigate = useNavigate();

  console.log(exams)

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await fetchExams();
      setExams(data);
    } catch {
      alert('Ошибка при загрузке экзаменов');
    }
  };

  const handleAddExam = async () => {
    try {
      await createExam(newExam);
      setNewExam({ crn: '', date: '' });
      setShowModal(false);
      loadExams();
    } catch {
      alert('Ошибка при добавлении экзамена');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Экзамены</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ➕ Добавить экзамен
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>CRN</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, idx) => (
            <tr key={exam.id}>
              <td>{idx + 1}</td>
              <td>{exam.crn}</td>
              <td>{exam.date}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => navigate(`/exams/${exam["gorm_._model"]?.ID}`)}
                >
                  Войти
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить экзамен</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>CRN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Напр. MATH9A"
                value={newExam.crn}
                onChange={e => setNewExam({ ...newExam, crn: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Дата</Form.Label>
              <Form.Control
                type="date"
                value={newExam.date}
                onChange={e => setNewExam({ ...newExam, date: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleAddExam}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExamsPage;
