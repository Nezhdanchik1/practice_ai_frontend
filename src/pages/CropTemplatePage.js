import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFCropper from '../components/PDFCropper';
import { Form, Button } from 'react-bootstrap';
import { createBBoxTemplate } from '../api/bboxTemplates';

export default function CropTemplatePage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const pdfCropperRef = useRef();
  const [pdfFile, setPdfFile] = useState(null);
  const [templateName, setTemplateName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Пожалуйста, выберите PDF-файл');
    }
  };

  const handleSave = async (bboxes) => {
    try {
      if (!templateName.trim()) {
        alert('Введите название шаблона');
        return;
      }

      const payload = {
        name: templateName,
        exam_id: Number(examId),
        bboxes: bboxes.map((b) => ({
          page: b.page,
          bbox_percent: JSON.stringify(b.bbox_percent),
        })),
      };

      await createBBoxTemplate(payload);

      alert('Шаблон успешно сохранён!');
      navigate(`/exams/${examId}`);
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения шаблона');
    }
  };

  return (
    <div className="container mt-4">
      <h2>✂️ Создание шаблона обрезки для экзамена #{examId}</h2>

      <Form.Group className="mb-3">
        <Form.Label>Название шаблона</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите название шаблона"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Загрузите PDF экзамена</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </Form.Group>

      {pdfFile && (
        <div className="mt-4">
          <PDFCropper
            ref={pdfCropperRef}
            pdfFile={pdfFile}
            onGenerate={handleSave}
          />
        </div>
      )}

      <Button variant="secondary" onClick={() => navigate(`/exams/${examId}`)}>
        Назад к экзамену
      </Button>
    </div>
  );
}
