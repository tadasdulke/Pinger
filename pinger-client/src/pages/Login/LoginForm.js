import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, withErrorWrapper } from '@Common'
import { changeToken } from '@Store/slices/auth';
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems'
import useLogin from './hooks/useLogin';


const LoginForm = ({errorHandler}) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const {loaded, sendAction} = useLogin(errorHandler);
    const dispath = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await sendAction(login, password);
        dispath(changeToken(token))
        localStorage.setItem(LOCAL_STORAGE_ITEMS.TOKEN, token)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input 
                type="text" 
                placeholder='username' 
                value={login} 
                onChange={(event) => setLogin(event.target.value)} 
            />
            <Input 
                type="password" 
                placeholder='password' 
                value={password}
                onChange={(event) => setPassword(event.target.value)} 
            />
            <Button type="submit">
                Login
            </Button>
        </form>
    )
}

export default withErrorWrapper(LoginForm);