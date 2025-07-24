import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { getAnswerImagesById } from '../api/answers';

const AnswerDetailPage = () => {
  const { id: answerId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null); // Для модалки

  useEffect(() => {
    loadAnswer();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;

      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % answer.images.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) =>
          prev === 0 ? answer.images.length - 1 : prev - 1
        );
      } else if (e.key === 'Escape') {
        setCurrentIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answer?.images]);

  const loadAnswer = async () => {
    try {
      const data = await getAnswerImagesById(answerId);
      setAnswer(data);
    } catch (err) {
      console.error('Ошибка при получении ответа:', err);
      alert('Ошибка при получении ответа');
      navigate('/exams');
    }
  };

  const normalizeUrl = (url) => {
    const internal = process.env.REACT_APP_MINIO_INTERNAL;
    const external = process.env.REACT_APP_MINIO_PUBLIC;
    return url?.replace(internal, external);
  };

  return (
    <div className="container mt-4">
      <h4>Ответ #{answer?.id}</h4>
      <p>
        <strong>PDF:</strong>{' '}
        <a href={normalizeUrl(answer?.pdf_url)} target="_blank" rel="noreferrer">
          {answer?.pdf_url}
        </a>
      </p>
      <p><strong>Оценка:</strong> {answer?.grade}</p>

      <h5>Изображения после обрезки:</h5>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '16px',
          paddingBottom: '10px'
        }}
      >
        {answer?.images?.map((img, index) => (
          <div
            key={img.id}
            onClick={() => setCurrentIndex(index)}
            style={{ flex: '0 0 auto', cursor: 'pointer' }}
          >
            <img
              src={normalizeUrl(img.url)}
              alt={`Cropped ${img.id}`}
              style={{
                height: '200px',
                width: '300px',
                border: '1px solid gray',
                objectFit: 'contain'
              }}
            />
          </div>
        ))}
      </div>

      <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
        ⬅ Назад
      </Button>

      <Modal
        show={currentIndex !== null}
        onHide={() => setCurrentIndex(null)}
        centered
        size="lg"
      >
        <Modal.Body className="d-flex justify-content-center align-items-center" style={{ backgroundColor: 'black' }}>
          {currentIndex !== null && (
            <img
              src={normalizeUrl(answer.images[currentIndex].url)}
              alt={`Full ${currentIndex}`}
              style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AnswerDetailPage;
