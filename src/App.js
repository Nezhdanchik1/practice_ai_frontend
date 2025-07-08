import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import CropPage from './pages/CropPage';
import PreviewPage from './pages/PreviewPage';
import DashboardPage from './pages/DashBoardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashBoardLayout';
import PrivateRoute from './components/PrivateRoute';
import ExamsPage from './pages/ExamsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Публичные */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищённые */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/crop" element={<CropPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/exams" element={<ExamsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
