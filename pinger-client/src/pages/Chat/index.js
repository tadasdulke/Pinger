import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Outlet } from 'react-router-dom';
import apiClient from '@Api';
import ChatOptionsMenu from './ChatOptionsMenu';

import UserSearch from './UserSearch';
import ChatSpaceInformation from './ChatSpaceInformation';

function Chat() {
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    const connection = new HubConnectionBuilder().withUrl('http://localhost:5122/hubs/chat').build();

    (async () => {
      await apiClient.refreshToken();
      await connection.start();
      setConnection(connection)
    })();

    if(connection) {
      return async () => await connection.stop();
    }
  }, []);

  useEffect(() => {
    if(connection) {
      const interval = setInterval(() => {
        connection.invoke("Ping");
      }, 5000);
  
      return () => clearInterval(interval);        
    }
  }, [connection]);

  if(!connection) {
    return null;
  }
  
  return (
    <Container
      style={{
        paddingLeft: '0px',
        paddingRight: '0px',
      }}
      className="h-full"
      fluid
    >
      <Row nogutter align="stretch" className="h-[60px] border-b-2 border-tuna-darker">
        <Col xs={4} lg={2} className="flex items-center">
          <ChatSpaceInformation/>
        </Col>
        <Col xs={8} lg={10} className="flex justify-center items-center py-[10px]">
          <UserSearch/>
        </Col>
      </Row>
      <Row nogutter align="stretch" className="h-[calc(100%-60px)]">
        <Col xs={4} lg={2} className="border-r-2 border-tuna-darker">
          <ChatOptionsMenu connection={connection} />
        </Col>
        <Col xs={8} lg={10} className="bg-tuna-darker">
          <Outlet context={{ connection }} />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
