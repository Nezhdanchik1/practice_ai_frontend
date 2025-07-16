import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function CropResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrls = [] } = location.state || {};

  return (
    <div className="container mt-4">
      <h3>Результаты обрезки ({imageUrls.length} изображений)</h3>

      {imageUrls.length === 0 ? (
        <p>Нет изображений для отображения.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {imageUrls.map((url, index) => (
            <div key={index} style={{ width: '300px' }}>
              <img
                src={url}
                alt={`Кадр ${index + 1}`}
                style={{ width: '100%', border: '1px solid #ccc' }}
              />
              <p className="text-center">Изображение {index + 1}</p>
            </div>
          ))}
        </div>
      )}

      <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>
        ⬅ Назад
      </Button>
    </div>
  );
}
