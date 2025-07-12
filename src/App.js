import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashBoardLayout';
import PrivateRoute from './components/PrivateRoute';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import CropTemplatePage from './pages/CropTemplatePage';

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
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:id" element={<ExamDetailPage />} />
          <Route path="/crop-template" element={<CropTemplatePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/exams" />} />
      </Routes>
    </Router>
  );
};

export default App;
