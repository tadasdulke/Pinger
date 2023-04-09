import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useFetchData} from '@Common';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import getChatSpaces from './serivces/getChatSpaces';
import useJoinChatSpace from './hooks/useJoinChatSpace';
import getUserChatSpaces from '../ChatSpaces/services/getUserChatSpaces';

function ChatSpaceRow({ name, chatspaceId, onClick }) {
  return (
    <button onClick={() => onClick(chatspaceId)} className="flex w-full items-center text-white p-[10px] hover:bg-tuna-darker">
      {name}
    </button>
  );
}

function JoinChatSpace() {
  const navigate = useNavigate();
  const { loaded: allChatSpacesLoaded, result: allChatSpaces } = useFetchData(
    getChatSpaces,
  );

  const { loaded: joinedChatSpacesLoaded, result: joinedChatSpaces } = useFetchData(
    getUserChatSpaces,
  );

  const { joinChatSpace } = useJoinChatSpace();

  const onClick = async (chatspaceId) => {
    const { status } = await joinChatSpace(chatspaceId);
    if (status === 204) {
      navigate(ROUTES.CHATSPACES);
    }
  };

  const resolveChatSpaces = () => {
    if(!allChatSpaces || !joinedChatSpaces) {
      return null;
    }

    return allChatSpaces.data.filter(chatSpace => !joinedChatSpaces.data.some(joinedChatSpace => joinedChatSpace.id === chatSpace.id) )
  }

  const chatspacesToDisplay = resolveChatSpaces();

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1 className="text-3xl mb-[30px] text-white mt-[10px]">
            Choose chatspace to join
          </h1>
          {chatspacesToDisplay?.map(({ id, name }) => (
            <ChatSpaceRow key={id} chatspaceId={id} onClick={onClick} name={name} />
          ))}
          {chatspacesToDisplay?.length <= 0 && <p className="text-white">There are no available chatspaces that you can join</p>}
        </Col>
      </Row>
    </Container>
  );
}

export default JoinChatSpace;
