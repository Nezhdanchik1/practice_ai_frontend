// src/components/usePdfImages.js
import { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

export const usePdfImages = (pdfFile) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const renderPDF = async () => {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        const pages = [];
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          await page.render({ canvasContext: ctx, viewport }).promise;

          const img = new window.Image();
          img.src = canvas.toDataURL();
          await new Promise((resolve) => (img.onload = resolve));

          pages.push({ img, width: canvas.width, height: canvas.height });
        }

        setImages(pages);
      };
      reader.readAsArrayBuffer(pdfFile);
    };

    if (pdfFile) renderPDF();
  }, [pdfFile]);

  return images;
};
