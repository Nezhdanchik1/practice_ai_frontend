import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {
  fetchBBoxTemplatesByExam,
  deleteBBoxTemplate,
  applyBBoxTemplate,
} from '../api/bboxTemplates';

export default function BBoxTemplateListPage() {
  const { examId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await fetchBBoxTemplatesByExam(examId);
      setTemplates(data);
    } catch {
      alert('Ошибка при загрузке шаблонов');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить шаблон?')) return;
    try {
      await deleteBBoxTemplate(id);
      loadTemplates();
    } catch {
      alert('Ошибка при удалении шаблона');
    }
  };

  const handleApply = async (tpl) => {
    setIsLoading(true);
    try {
      const payload = tpl.bboxes.map((b) => ({
        page: b.page,
        bbox_percent: JSON.parse(b.bbox_percent),
      }));

      const result = await applyBBoxTemplate(examId, payload);
      navigate(`/exams/${examId}`);
    } catch (err) {
      alert('Ошибка при применении шаблона: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Шаблоны обрезки для экзамена #{examId}</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Название</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Нет шаблонов</td>
            </tr>
          ) : (
            templates.map((tpl, index) => (
              <tr key={tpl.id}>
                <td>{index + 1}</td>
                <td>{tpl.id}</td>
                <td>{tpl.name}</td>
                <td>{new Date(tpl.created_at).toLocaleString()}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApply(tpl)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Применяется...' : 'Применить'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(tpl.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Button variant="secondary" onClick={() => navigate(`/exams/${examId}`)}>
        ⬅ Назад к экзамену
      </Button>
    </div>
  );
}
