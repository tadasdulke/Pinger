import React from 'react'

import { HubConnectionBuilder } from '@microsoft/signalr'
import { Row, Container } from 'react-grid-system'

const connection = new HubConnectionBuilder().withUrl("http://localhost/chat").build();

const App = () => {
    connection.on("ReceiveMessage", data => {
        console.log(data);
    })

    connection.start().then(() => {
        connection.invoke("SendMessage", "test");
    })


    return <div>testfdssafdsfs</div>
}

export default App;