// src/pages/CropTemplatePage.js
import React, { useState } from 'react';
import PDFCropper from '../components/PDFCropper';
import { Button, Form } from 'react-bootstrap';

const CropTemplatePage = () => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Пожалуйста, выберите PDF-файл');
    }
  };

  return (
    <div className="container mt-4">
      <h2>✂️ Создание шаблона обрезки</h2>
      <p className="text-muted">Загрузите PDF, чтобы начать разметку.</p>

      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </Form.Group>

      {pdfFile && (
        <div className="mt-4">
          <PDFCropper pdfFile={pdfFile} />
        </div>
      )}
    </div>
  );
};

export default CropTemplatePage;
