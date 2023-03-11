import React, {useEffect} from 'react';
import { Container, Row, Col } from 'react-grid-system';
import {HubConnectionBuilder} from "@microsoft/signalr";

import ChatMessages from './ChatMessages';
import ChatOptionsMenu from './ChatOptionsMenu'

const Chat = () => {
    const connection = new HubConnectionBuilder().withUrl("http://localhost:5122/hubs/chat").build()
    
    useEffect(() => {
        (async () => {
            await connection.start();
        })();

        return async () => await connection.stop();
    }, [])

    connection.on("ReceiveMessage", data => {
        console.log(data);
    });

    return (
        <Container
            style={{
                paddingLeft: "0px",
                paddingRight: "0px"
            }}
            className="h-full"
            fluid
        >
            <Row nogutter align="stretch" className="h-full">
                <Col xs={4} lg={2}>
                    <ChatOptionsMenu/>
                </Col>
                <Col xs={8} lg={10} className="bg-tuna-darker">
                    <ChatMessages connection={connection} />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;