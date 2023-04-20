import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@Router';
import { useApiAction } from '@Common';
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';

import revokeToken from './services/revokeToken';
import ChannelList from './components/ChannelList';
import ContactedUserList from './components/ContactedUsersList';
import { restore as restoreAuthStore } from '@Store/slices/auth';
import { restore as restoreWorkspaceStore } from '@Store/slices/workspaces';

function MessagingOptions({ connection }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOwner } = useSelector(state => state.workspace)

  const { sendAction: revokeTokenAction } = useApiAction(
    revokeToken,
  );

  const onLogOut = async () => {
    const { status } = await revokeTokenAction();
    if (status === 204) {
      localStorage.clear();
      dispatch(restoreAuthStore())
      dispatch(restoreWorkspaceStore())
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-white">
      <div className="relative h-full">
        <div className="absolute overflow-y-auto bottom-0 top-0 left-0 right-0">
          <ChannelList connection={connection}/>
          <ContactedUserList connection={connection} />
        </div>
      </div>
      <div>
        {isOwner && <button
            className="flex items-center text-left py-[10px] px-[5px] w-full hover:text-red-600"
            onClick={() => navigate("manage-chatspace")}
        >
            <ReactSVG 
              src="http://localhost:5122/public/icons/manage.svg"
              beforeInjection={(svg) => {
                svg.setAttribute('width', '30px');
                svg.setAttribute('height', '30px');
              }}  
            />
          <span className="ml-[10px]">Manage chatspace</span>
        </button>}
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

export default MessagingOptions;
