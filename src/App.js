import React, { useState } from 'react';
import PDFCropper from './PDFCropper';

function App() {
  const [file, setFile] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h2>PDF Обрезка Заданий</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file && <PDFCropper pdfFile={file} />}
    </div>
  );
}

export default App;
