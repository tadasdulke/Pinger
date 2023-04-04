import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import { withErrorWrapper, useApiAction } from '@Common';
import { ReactSVG } from 'react-svg';

import revokeToken from './services/revokeToken';
import ChannelList from './components/ChannelList';
import ContactedUserList from './components/ContactedUsersList';

function MessagingOptions({ errorHandler, connection }) {
  const navigate = useNavigate();

  const { sendAction: revokeTokenAction } = useApiAction(
    revokeToken,
    errorHandler,
  );

  const onLogOut = async () => {
    localStorage.clear();
    const { status } = await revokeTokenAction();
    if (status === 204) {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-white">
      <div>
        <ChannelList connection={connection}/>
        <ContactedUserList connection={connection} />
      </div>
      <div>
        <button
            className="flex items-center text-left py-[10px] px-[5px] w-full hover:text-red-600"
            onClick={() => navigate(ROUTES.CHATSPACES)}
        >
            <ReactSVG
                src="http://localhost:5122/public/icons/people.svg"
                beforeInjection={(svg) => {
                    svg.setAttribute('width', '30px');
                    svg.setAttribute('height', '30px');
                }}
            />
            <span className="ml-[10px]">Change chatspace</span>
        </button>
        <button
            className="flex items-center text-left py-[10px] px-[5px] w-full hover:text-red-600"
            onClick={onLogOut}
        >
            <ReactSVG
                src="http://localhost:5122/public/icons/logout.svg"
                beforeInjection={(svg) => {
                    svg.setAttribute('width', '30px');
                    svg.setAttribute('height', '30px');
                }}
            />
            <span className="ml-[10px]">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default withErrorWrapper(MessagingOptions);
