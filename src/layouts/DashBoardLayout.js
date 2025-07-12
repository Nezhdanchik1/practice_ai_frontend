// src/layouts/DashboardLayout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import useLogout from '../hooks/useLogout'; // путь подкорректируй по факту

const DashboardLayout = () => {
  const logout = useLogout();

  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={3} lg={2} className="bg-light vh-100 p-3 border-end">
          <h4 className="mb-4">SmartGrader</h4>
          <Nav className="flex-column">
            <NavLink to="/exams" className="nav-link">📚 Экзамены</NavLink>
            <Nav.Link as="button" onClick={logout} className="nav-link btn btn-link text-start">🚪 Выход</Nav.Link>
          </Nav>
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};


export default DashboardLayout;