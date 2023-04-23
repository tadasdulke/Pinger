import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import { Button, Loader } from '@Common'
import {
  useJoinChatSpace, 
  useFetchAllChatSpaces, 
  useFetchUserChatSpaces, 
  useFetchInvitedChatSpaces,
  useAcceptInvitation
} from './hooks';

function ChatSpaceRow({ 
  name, 
  chatspaceId, 
  onClick, 
  buttonText
}) {
  return (
    <div 
      className="flex w-full items-center text-white p-[10px] hover:bg-tuna-darker justify-between"
    >
      <p>
        {name}
      </p>
      <Button
        onClick={() => onClick(chatspaceId)} 
      >
        {buttonText}
      </Button>
    </div>
  );
}

function JoinChatSpace() {
  const navigate = useNavigate();

  const { allChatSpaces, allChatSpacesLoaded } = useFetchAllChatSpaces();
  const { joinedChatSpaces, joinedChatSpacesLoaded } = useFetchUserChatSpaces()
  const { invitedChatSpaces, invitedChatSpacesLoaded } = useFetchInvitedChatSpaces()
  const { joinChatSpace } = useJoinChatSpace();
  const { acceptInvitationAction } = useAcceptInvitation();

  const onClick = async (chatspaceId) => {
    const { status } = await joinChatSpace(chatspaceId);

    if (status === 204) {
      navigate(ROUTES.CHATSPACES);
    }
  };

  const acceptInvitation = async (chatSpaceId) => {
    const { status } = await acceptInvitationAction(chatSpaceId);

    if (status === 204) {
      navigate(ROUTES.CHATSPACES);
    }
  }

  const resolvePublicChatSpaces = () => {
    if(!allChatSpaces || !joinedChatSpaces) {
      return [];
    }

    return allChatSpaces.data.filter(chatSpace => !joinedChatSpaces.data.some(joinedChatSpace => joinedChatSpace.id === chatSpace.id) )
  }

  const publicChatspacesToDisplay = resolvePublicChatSpaces();
  const chatSpacesWithInvites = invitedChatSpaces?.data || [];

  const shouldShowPublicChatSpacesInfoMessage = allChatSpacesLoaded && joinedChatSpacesLoaded && publicChatspacesToDisplay?.length <= 0;
  const shouldShowInvitedInfoMessage = invitedChatSpacesLoaded && chatSpacesWithInvites <= 0;
  
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1 className="text-3xl mb-[30px] text-white mt-[10px]">
            Choose chatspace to join
          </h1>
          <div className="py-[10px]">
            <h2 className="text-white text-xl mb-[5px]">
              Public chatspaces
            </h2>
            <Loader height={60} loaded={allChatSpacesLoaded && joinedChatSpacesLoaded} />
            {publicChatspacesToDisplay?.map(({ id, name }) => (
              <ChatSpaceRow 
                key={id} 
                chatspaceId={id} 
                onClick={onClick} 
                name={name}
                buttonText="Join"
              />
            ))}
            {shouldShowPublicChatSpacesInfoMessage && <p className="text-white my-[10px]">There are no available chatspaces to join</p>}
          </div>
          <div>
          <h2 className="text-white text-xl">
            Chatspaces you've been invited too
          </h2>
          <Loader height={60} loaded={invitedChatSpacesLoaded} />
          {chatSpacesWithInvites?.map(({ id, name }) => (
            <ChatSpaceRow 
              key={id} 
              chatspaceId={id} 
              onClick={acceptInvitation} 
              name={name}
              buttonText="Accept invite"
            />
          ))}
          {shouldShowInvitedInfoMessage && <p className="text-white mt-[10px]">You have no invites to any chatspaces</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default JoinChatSpace;
