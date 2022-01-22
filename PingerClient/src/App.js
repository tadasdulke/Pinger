import React from 'react'
import {HubConnectionBuilder} from '@microsoft/signalr'
import {Col, Row, Container} from 'react-grid-system'

import { Comunications } from './components';


const connection = new HubConnectionBuilder().withUrl("http://localhost:4000/chat").build();
connection.start()

const App = () => {
    connection.on("ReceiveMessage", data => {
        console.log(data);
    })

    const send = () => {
        connection.invoke("SendMessage", "Hello");
    
    }

    return (
        <Container fluid style={{padding: '0'}}>
            <Row nogutter>
                <Col xs={3}>
                    <Comunications/>
                </Col>
                <Col xs={6}>
                    test
                </Col>
                <Col xs={3}>
                    test
                </Col>
            </Row>
        </Container>
    )
}

export default App;