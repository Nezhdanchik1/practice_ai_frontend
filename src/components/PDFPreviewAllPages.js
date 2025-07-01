// src/components/PDFPreviewAllPages.js
import React from 'react';
import { usePdfImages } from './usePdfImages';

const PDFPreviewAllPages = ({ pdfFile }) => {
  const images = usePdfImages(pdfFile);

  return (
    <div style={{ marginTop: 20 }}>
      {images.map((img, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <h4>Страница {i + 1}</h4>
          <img src={img.img.src} width="300" alt={`page-${i + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default PDFPreviewAllPages;
