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
import BBoxTemplateListPage from './pages/BBoxTemplateListPage';
import CropResultPage from './pages/CropResultPage';
import AnswerDetailPage from './pages/AnswerDetailPage';

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
          <Route path="/exams/:id/crop-template" element={<CropTemplatePage />} />
          <Route path="/exams/:examId/bboxes" element={<BBoxTemplateListPage />} />
          <Route path="/crop-result" element={<CropResultPage />} />
          <Route path="/answers/:id" element={<AnswerDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/exams" />} />
      </Routes>
    </Router>
  );
};

export default App;
