import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Container, Row, Col, Form } from 'react-bootstrap';

const assessments = [
  { id: 1, name: 'Chemistry Assessment', date: '27th Jan, 25', questions: 13, type: 'Test Paper' },
  { id: 2, name: 'Physics Assessment', date: '27th Jan, 25', questions: 7, type: 'Test Paper' },
  { id: 3, name: 'OMR Test Jan 18', date: '18th Jan, 25', questions: 20, type: 'Tick OMR' },
  { id: 4, name: 'Set Theory: Basics (11 Jan)', date: '11th Jan, 25', questions: 2, type: 'Test Paper' },
];

const DashboardPage = () => {
  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h2>Assessments</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success">+ Create Assessment</Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control type="text" placeholder="Search Assessments" />
        </Col>
      </Row>

      <Table bordered hover responsive className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Assessment Name</th>
            <th>Date</th>
            <th>Total Questions</th>
            <th>Type</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.date}</td>
              <td>{a.questions}</td>
              <td>{a.type}</td>
              <td className="text-center">
                <Button variant="link" size="sm">Scan</Button>
                <Button variant="link" size="sm">Results</Button>
                <Button variant="danger" size="sm">🗑</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DashboardPage;
