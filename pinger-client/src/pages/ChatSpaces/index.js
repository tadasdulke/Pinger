import React from 'react';
import { Container, Row, Col} from 'react-grid-system'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchData, withErrorWrapper } from '@Common';
import { ROUTES } from '@Router'
import { changeCurrentWorkspaceId } from '@Store/slices/workspaces';
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems'
import getUserChatSpaces from './services/getUserChatSpaces';
import ChatSpace from './ChatSpace';
import CreateChatSpace from './CreateChatSpace'
import JoinChatSpace from './JoinChangeSpace';

const ChatSpaces = ({ errorHandler }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loaded, result: chatSpaces } = useFetchData(
        getUserChatSpaces,
        errorHandler,
    );

    const selectWorkspace = (workspaceId) => {
        dispatch(changeCurrentWorkspaceId(workspaceId));
        localStorage.setItem(LOCAL_STORAGE_ITEMS.WORKSPACE_ID, workspaceId)
        navigate(ROUTES.USE_CHATSPACE);
    }

    return (
        <Container className="top-1/2 translate-y-[-50%]">
            <Row>
                <Col xs={12}>
                    <Row justify="center">
                        {chatSpaces?.data?.map(({name, id}) => (
                            <ChatSpace onClick={() => selectWorkspace(id)} name={name} key={id} />
                        ))}
                        <JoinChatSpace/>
                        <CreateChatSpace/>
                    </Row>
                </Col>
            </Row>
        </Container>
    );

}

export default withErrorWrapper(ChatSpaces);