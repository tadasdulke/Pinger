import React from 'react';
import { ReactSVG } from 'react-svg';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import ChatSpace from './ChatSpace';

function JoinChatSpace() {
  const navigate = useNavigate();

  return (
    <ChatSpace
      name="Join Chatspace"
      className="p-[1rem]"
      onClick={() => navigate(ROUTES.JOIN_CHATSPACE)}
      image={(
        <ReactSVG
          src="http://localhost:5122/public/icons/people.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
          }}
        />
      )}
    />
  );
}

export default JoinChatSpace;
