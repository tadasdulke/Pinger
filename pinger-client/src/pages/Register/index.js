import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import RegisterForm from './RegisterForm';

function Register() {
  return (
    <Container className="top-1/2 translate-y-[-50%]">
      <Row>
        <Col xs={12} md={10} lg={6} offset={{ lg: 3, md: 1 }}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
