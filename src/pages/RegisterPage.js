import React, { useState } from 'react';
import { register } from '../api/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Валидация
    if (!email || !password || !repeatPassword) {
      return setError('Заполните все поля');
    }
    if (!validateEmail(email)) {
      return setError('Некорректный email');
    }
    if (password.length < 6) {
      return setError('Пароль должен содержать минимум 6 символов');
    }
    if (password !== repeatPassword) {
      return setError('Пароли не совпадают');
    }

    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.message || 'Попробуйте снова'));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Регистрация</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Повторите пароль</label>
          <input
            type="password"
            className="form-control"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;
