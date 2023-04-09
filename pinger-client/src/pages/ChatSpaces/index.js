import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFetchData, Button } from '@Common';
import { ROUTES } from '@Router';
import { changeCurrentWorkspaceId } from '@Store/slices/workspaces';
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems';
import getUserChatSpaces from './services/getUserChatSpaces';
import ChatSpace from './ChatSpace';
import CreateChatSpace from './CreateChatSpace';
import JoinChatSpace from './JoinChangeSpace';
import useAppendClaims from './hooks/useAppendClaims';

import { restore as restoreChatStore } from '../../store/slices/chat';
import { restore as restoreChannelStore } from '../../store/slices/channels';
import { restore as restoreContactedUsersStore } from '../../store/slices/contactedUsers';
import { restore as restoreChatspaceStore } from '../../store/slices/workspaces';

function ChatSpaces() {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loaded, result: chatSpaces } = useFetchData(
    getUserChatSpaces,
  );

  useEffect(() => {
    dispatch(restoreChatStore())
    dispatch(restoreChannelStore())
    dispatch(restoreContactedUsersStore())
    dispatch(restoreChatspaceStore())
  }, [])

  const { addClaims } = useAppendClaims();

  const selectWorkspace = async (workspaceId) => {
    const { status } = await addClaims(workspaceId);

    if (status === 204) {
      dispatch(changeCurrentWorkspaceId(workspaceId));
      localStorage.setItem(LOCAL_STORAGE_ITEMS.WORKSPACE_ID, workspaceId);
      navigate(ROUTES.USE_CHATSPACE);
    }
  };

  const chatSpacesToDisplay = !showAll ? chatSpaces?.data?.slice(0, 2) : chatSpaces?.data;

  return (
    <Container className="top-1/2 translate-y-[-50%]">
      <Row>
        <Col xs={12}>
          <Row justify="center">
            {chatSpacesToDisplay?.map(({ name, id }) => (
              <ChatSpace 
                image={<div className="text-white flex justify-center items-center h-full text-3xl">{name[0].toUpperCase()}</div>}  
                onClick={() => selectWorkspace(id)} 
                name={name} 
                key={id}
               />
            ))}
            <JoinChatSpace />
            <CreateChatSpace />
          </Row>
        </Col>
        <Col xs={12}>
          <div className="flex justify-center mt-[20px]">
            <Button onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show less" : "Show all"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatSpaces;
