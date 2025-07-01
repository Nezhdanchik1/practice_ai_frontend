// src/pages/CropPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PDFCropper from '../components/PDFCropper';
import './CropPage.css'; // стили подключаются здесь

const CropPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfFile = location.state?.pdfFile;

  if (!pdfFile) {
    return (
      <div className="crop-wrapper">
        <div className="crop-error">
          <h2>Файл не найден</h2>
          <p>Пожалуйста, сначала загрузите PDF.</p>
          <button onClick={() => navigate('/')}>⬅ Назад к загрузке</button>
        </div>
      </div>
    );
  }

  return (
    <div className="crop-wrapper">
      <header className="crop-header">
        <h1>📄 Обрезка заданий PDF</h1>
        <p className="crop-subtitle">
          Выделите прямоугольники вокруг заданий на каждой странице.
        </p>
      </header>

      <main className="crop-content">
        <PDFCropper pdfFile={pdfFile} />
      </main>
    </div>
  );
};

export default CropPage;
