import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useFetchData, withErrorWrapper } from '@Common';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import getChatSpaces from './serivces/getChatSpaces';
import useJoinChatSpace from './hooks/useJoinChatSpace';

const ChatSpaceRow = ({name, chatspaceId, onClick}) => {
    return (
        <button onClick={() => onClick(chatspaceId)} className="flex items-center text-white p-[10px]">
            {name}
        </button>
    )
}

const JoinChatSpace = ({errorHandler}) => {
    const navigate = useNavigate();
    const { loaded, result } = useFetchData(
        getChatSpaces,
        errorHandler
    )

    const { joinChatSpace } = useJoinChatSpace(errorHandler);

    const onClick = async (chatspaceId) => {
        const { status } = await joinChatSpace(chatspaceId);
        if(status === 204) {
            navigate(ROUTES.CHATSPACES);
        }
    }

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    {result && result.data.map(({id, name}) => (
                        <ChatSpaceRow chatspaceId={id} onClick={onClick} name={name} />
                    ))}
                </Col>
            </Row>
        </Container>
    )
}

export default withErrorWrapper(JoinChatSpace);