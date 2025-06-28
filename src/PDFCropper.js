import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage, Text } from 'react-konva';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PDFCropper({ pdfFile }) {
  const [images, setImages] = useState([]);
  const [bboxes, setBboxes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bboxMapText, setBBoxMapText] = useState('');
  const transformerRefs = useRef([]);

  useEffect(() => {
    const b = bboxes.find(b => b.id === selectedId);
    if (!b || !images.length) return;

    const stage = transformerRefs.current[b.pageIndex]?.getStage?.();
    const selectedNode = stage?.findOne(`#${selectedId}`);
    if (selectedNode) {
      transformerRefs.current[b.pageIndex].nodes([selectedNode]);
      transformerRefs.current[b.pageIndex].getLayer().batchDraw();
    }
  }, [selectedId, images]);

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
          await new Promise(resolve => (img.onload = resolve));

          pages.push({ img, width: canvas.width, height: canvas.height });
        }
        setImages(pages);
      };
      reader.readAsArrayBuffer(pdfFile);
    };

    if (pdfFile) renderPDF();
  }, [pdfFile]);

  const addBox = (pageIndex, width, height) => {
    const box = {
      id: Date.now().toString(),
      pageIndex,
      x: width * 0.1,
      y: height * 0.1,
      width: width * 0.5,
      height: height * 0.2
    };
    setBboxes(prev => [...prev, box]);
    setSelectedId(box.id);
  };

  const handleTransform = (node, id) => {
    const updated = bboxes.map(b => {
      if (b.id !== id) return b;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      return {
        ...b,
        x: node.x(),
        y: node.y(),
        width: Math.max(20, node.width() * scaleX),
        height: Math.max(20, node.height() * scaleY)
      };
    });
    setBboxes(updated);
  };

  const handleDelete = () => {
    if (selectedId) {
      setBboxes(bboxes.filter(b => b.id !== selectedId));
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const listener = e => {
      if (e.key === 'Delete') handleDelete();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [selectedId, bboxes]);

  const generateBBoxMap = () => {
    const result = bboxes.map(b => {
      const img = images[b.pageIndex];
      const x1 = (b.x / img.width).toFixed(2);
      const y1 = (b.y / img.height).toFixed(2);
      const x2 = ((b.x + b.width) / img.width).toFixed(2);
      const y2 = ((b.y + b.height) / img.height).toFixed(2);
      return ` {${b.pageIndex}, [4]float64{${x1}, ${y1}, ${x2}, ${y2}}},`;
    });

    const fullText = `var bboxMap = []BBoxMeta{\n${result.join('\n')}\n}`;
    setBBoxMapText(fullText);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bboxMapText);
      alert('Скопировано!');
    } catch (e) {
      alert('Ошибка при копировании');
    }
  };

  return (
    <div>
      {images.map((img, pageIndex) => (
        <div key={pageIndex} style={{ marginBottom: '40px' }}>
          <h3>Страница {pageIndex + 1}</h3>
          <button onClick={() => addBox(pageIndex, img.width, img.height)}>Добавить обрезку</button>
          <Stage width={img.width} height={img.height}>
            <Layer>
              <KonvaImage image={img.img} width={img.width} height={img.height} />
              {bboxes
                .filter(b => b.pageIndex === pageIndex)
                .map((b, i) => (
                  <React.Fragment key={b.id}>
                    <Rect
                      id={b.id}
                      x={b.x}
                      y={b.y}
                      width={b.width}
                      height={b.height}
                      stroke={b.id === selectedId ? 'blue' : 'red'}
                      strokeWidth={2}
                      draggable
                      onClick={() => setSelectedId(b.id)}
                      onTap={() => setSelectedId(b.id)}
                      onTransformEnd={e => handleTransform(e.target, b.id)}
                      onDragEnd={e => {
                        const updated = bboxes.map(box =>
                          box.id === b.id
                            ? { ...box, x: e.target.x(), y: e.target.y() }
                            : box
                        );
                        setBboxes(updated);
                      }}
                    />
                    <Text
                      text={(bboxes.filter(bb => bb.pageIndex === pageIndex).indexOf(b) + 1).toString()}
                      x={b.x + 4}
                      y={b.y + 4}
                      fontSize={16}
                      fill="black"
                      fontStyle="bold"
                    />
                  </React.Fragment>
                ))}
              <Transformer ref={el => (transformerRefs.current[pageIndex] = el)} />
            </Layer>
          </Stage>
        </div>
      ))}

      <button onClick={generateBBoxMap} style={{ marginTop: '20px' }}>Сгенерировать bboxMap</button>
      <button onClick={copyToClipboard} style={{ marginLeft: '10px' }}>Копировать bboxMap</button>

      {bboxMapText && (
        <textarea
          value={bboxMapText}
          readOnly
          rows={10}
          cols={80}
          style={{ marginTop: '20px', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace' }}
        />
      )}
    </div>
  );
}

export default PDFCropper;
