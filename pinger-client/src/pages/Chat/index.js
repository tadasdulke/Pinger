import React, {useEffect} from 'react';
import { Container, Row, Col } from 'react-grid-system';
import {HubConnectionBuilder} from "@microsoft/signalr";
import { Outlet } from 'react-router-dom';
import apiClient from '@Api'
import ChatOptionsMenu from './ChatOptionsMenu'

const Chat = () => {
    const connection = new HubConnectionBuilder().withUrl("http://localhost:5122/hubs/chat").build()
    useEffect(() => {
        (async () => {
            await apiClient.refreshToken();
            await connection.start();
        })();

        return async () => await connection.stop();
    }, [])

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
                    <Outlet context={{connection}} />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;