import React, {useState} from 'react';
import { useFetchData, useApiAction, withErrorWrapper, Input, Button } from '@Common';
import getUserChatSpaces from './services/getUserChatSpaces';
import createChatSpace from './services/createChatSpace';

const ChatSpaces = ({errorHandler}) => {
    const [workspaceName, setWorkspaceName] = useState('')
    const { loaded, result, reload } = useFetchData(
        getUserChatSpaces,
        errorHandler,
    );

    const { loaded: created, sendAction } = useApiAction(createChatSpace, errorHandler);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendAction(workspaceName);
        await reload();
    }


    return result && (
        <div>
            {result.map(workspace => <div>{workspace.name}</div>)}
            <form onSubmit={handleSubmit}>
                <Input type="text" placeholder="Enter workspace id" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
                <Button type="submit">
                    Add workspace
                </Button>
            </form>
        </div>
    )
}

export default withErrorWrapper(ChatSpaces);