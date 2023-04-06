import React from 'react';
import { ReactSVG } from 'react-svg';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import ChatSpace from './ChatSpace';

function CreateChatSpace() {
  const navigate = useNavigate();

  return (
    <ChatSpace
      onClick={() => navigate(ROUTES.CREATE_CHATSPACE)}
      name="Create Chatspace"
      image={(
        <ReactSVG
          src="http://localhost:5122/public/icons/plus.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '100%');
            svg.setAttribute('fill', 'white');
          }}
        />
      )}
    />
  );
}

export default CreateChatSpace;
