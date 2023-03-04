import React from 'react';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import LoginForm from './LoginForm'

const Login = () => {
    
    return (
    <Container className="top-1/2 translate-y-[-50%]">
        <Row>
            <Col xs={12} md={10} lg={6} offset={{lg: 3, md: 1 }}>
                <LoginForm />
            </Col>
        </Row>
    </Container>
)}

export default Login;