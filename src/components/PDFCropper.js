import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image as KonvaImage, Text } from 'react-konva';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import './PDFCropper.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PDFCropper({ pdfFile }) {
  const [images, setImages] = useState([]);
  const [bboxes, setBboxes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bboxMapText, setBBoxMapText] = useState('');
  const transformerRefs = useRef({});

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

  useEffect(() => {
    const listener = e => {
      if (e.key === 'Delete') handleDelete();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [selectedId, bboxes]);

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

  const handleDelete = () => {
    if (selectedId) {
      setBboxes(bboxes.filter(b => b.id !== selectedId));
      setSelectedId(null);
    }
  };

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
    <div className="cropper-wrapper">
      {images.map((img, pageIndex) => (
        <div key={pageIndex} className="cropper-page-block">
          <div className="cropper-page-header">
            <h3>Страница {pageIndex + 1}</h3>
            <button className="cropper-btn" onClick={() => addBox(pageIndex, img.width, img.height)}>
              ➕ Добавить обрезку
            </button>
          </div>

          <div className="stage-wrapper">
            <Stage width={img.width} height={img.height}>
              <Layer>
                <KonvaImage image={img.img} width={img.width} height={img.height} />
                {bboxes
                  .filter(b => b.pageIndex === pageIndex)
                  .map(b => (
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
                        dragBoundFunc={pos => {
                          const page = images[b.pageIndex];
                          const width = b.width;
                          const height = b.height;
                          return {
                            x: Math.max(0, Math.min(pos.x, page.width - width)),
                            y: Math.max(0, Math.min(pos.y, page.height - height))
                          };
                        }}
                        onClick={() => setSelectedId(b.id)}
                        onTap={() => setSelectedId(b.id)}
                        onTransformEnd={e => {
                          const node = e.target;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();
                          const page = images[b.pageIndex];

                          let newWidth = node.width() * scaleX;
                          let newHeight = node.height() * scaleY;
                          let newX = node.x();
                          let newY = node.y();

                          node.scaleX(1);
                          node.scaleY(1);

                          // Ограничение справа и снизу
                          if (newX + newWidth > page.width) {
                            newWidth = page.width - newX;
                          }
                          if (newY + newHeight > page.height) {
                            newHeight = page.height - newY;
                          }

                          // Ограничение сверху и слева
                          if (newX < 0) {
                            newWidth += newX;
                            newX = 0;
                          }
                          if (newY < 0) {
                            newHeight += newY;
                            newY = 0;
                          }

                          const updated = bboxes.map(box =>
                            box.id === b.id
                              ? {
                                  ...box,
                                  x: newX,
                                  y: newY,
                                  width: Math.max(20, newWidth),
                                  height: Math.max(20, newHeight)
                                }
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
                      {b.id === selectedId && (
                        <Transformer
                          ref={node => {
                            if (node && selectedId) {
                              const stage = node.getStage();
                              const selectedNode = stage.findOne(`#${selectedId}`);
                              if (selectedNode) {
                                node.nodes([selectedNode]);
                                node.getLayer().batchDraw();
                              }
                            }
                          }}
                          boundBoxFunc={(oldBox, newBox) => {
                            const b = bboxes.find(b => b.id === selectedId);
                            const page = b ? images[b.pageIndex] : null;
                            if (!page) return oldBox;

                            const box = { ...newBox };

                            if (box.x < 0) {
                              box.width += box.x;
                              box.x = 0;
                            }
                            if (box.y < 0) {
                              box.height += box.y;
                              box.y = 0;
                            }
                            if (box.x + box.width > page.width) {
                              box.width = page.width - box.x;
                            }
                            if (box.y + box.height > page.height) {
                              box.height = page.height - box.y;
                            }

                            box.width = Math.max(20, box.width);
                            box.height = Math.max(20, box.height);

                            return box;
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </Layer>
            </Stage>
          </div>
        </div>
      ))}

      <div className="cropper-action-buttons">
        <button className="cropper-btn" onClick={generateBBoxMap}>🧩 Сгенерировать bboxMap</button>
        <button className="cropper-btn secondary" onClick={copyToClipboard}>📋 Копировать bboxMap</button>
      </div>

      {bboxMapText && (
        <textarea
          className="cropper-textarea"
          value={bboxMapText}
          readOnly
          rows={10}
        />
      )}
    </div>
  );
}

export default PDFCropper;
