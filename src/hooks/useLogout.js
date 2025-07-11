// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Очистка токена
    localStorage.removeItem('token'); // или sessionStorage.clear();

    // Другие очистки, если нужно:
    // localStorage.removeItem('user');
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Перенаправление на страницу логина
    navigate('/login');
  };

  return logout;
};

export default useLogout;
