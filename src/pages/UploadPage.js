// src/pages/UploadPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PDFPreviewAllPages from '../components/PDFPreviewAllPages';
import './UploadPage.css';

const UploadPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setPdfFile(null);
      setError('Пожалуйста, загрузите PDF файл.');
    }
  };

  const handleSubmit = () => {
    if (pdfFile) {
      navigate('/crop', { state: { pdfFile } });
    } else {
      setError('Сначала выберите PDF файл.');
    }
  };

  return (
    <div className="upload-container">
      <h1>Загрузите PDF экзамена</h1>

      <div className="upload-box">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          id="file-upload"
          hidden
        />
        <label htmlFor="file-upload" className="upload-label">
          {pdfFile ? pdfFile.name : 'Нажмите или перетащите PDF сюда'}
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      {pdfFile && <PDFPreviewAllPages pdfFile={pdfFile} />}

      <button className="upload-button" onClick={handleSubmit}>
        Продолжить
      </button>
    </div>
  );
};

export default UploadPage;
