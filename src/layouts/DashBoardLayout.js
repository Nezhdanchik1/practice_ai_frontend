// src/layouts/DashboardLayout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardLayout = () => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2} className="bg-light vh-100 p-3 border-end">
          <h4 className="mb-4">📚 SmartGrader</h4>
          <Nav className="flex-column">
            <NavLink to="/" className="nav-link">🏠 Главная</NavLink>
            <NavLink to="/upload" className="nav-link">✂️ Обрезка</NavLink>
          </Nav>
        </Col>

        {/* Main content */}
        <Col xs={12} md={9} lg={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;