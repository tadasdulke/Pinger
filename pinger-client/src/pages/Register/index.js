import React, { useState } from 'react';
import { Container } from 'react-grid-system';
import { Button, withErrorWrapper } from '@Common'
import useRegistration from './hooks/useRegistration'

const Register = ({errorHandler}) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {loaded, sendAction} = useRegistration(errorHandler);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendAction(email, username, password)
    }

    return (
        <Container>
            <form onSubmit={handleSubmit} >
                {/* <Input type="text" placeholder="enter email" value={email} onChange={(event) => setEmail(event.target.value)} /> */}
                {/* <Input type="text" placeholder="enter username" value={username} onChange={(event) => setUsername(event.target.value)} /> */}
                {/* <Input type="password" placeholder="enter password" value={password} onChange={(event) => setPassword(event.target.value)} /> */}
                <Button type="submit">
                    Confirm
                </Button>
            </form>
        </Container>
    )
}

export default withErrorWrapper(Register);