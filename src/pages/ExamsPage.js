import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { fetchExams, createExam, deleteExam } from '../api/exams';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', date: '' });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await fetchExams();
      setExams(data);
    } catch (err) {
      alert('Ошибка при загрузке экзаменов');
    }
  };

  const handleAddExam = async () => {
    try {
      await createExam(newExam);
      setNewExam({ name: '', date: '' });
      setShowModal(false);
      loadExams();
    } catch (err) {
      alert('Ошибка при добавлении экзамена');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить экзамен?')) {
      try {
        await deleteExam(id);
        loadExams();
      } catch (err) {
        alert('Ошибка при удалении экзамена');
      }
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
            <th>Название</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, idx) => (
            <tr key={exam.id}>
              <td>{idx + 1}</td>
              <td>{exam.name}</td>
              <td>{exam.date}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(exam.id)}>
                  Удалить
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
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Напр. Математика 11 класс"
                value={newExam.name}
                onChange={e => setNewExam({ ...newExam, name: e.target.value })}
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
