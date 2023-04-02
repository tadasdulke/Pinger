import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '@Router';
import { useFetchData, withErrorWrapper, useApiAction } from '@Common';
import { addContactedUser, highlightUser } from '@Store/slices/contactedUsers';
import { addChannel, highlightChannel, removeChannel } from '@Store/slices/channels';
import { ReactSVG } from 'react-svg';
import getChannels from './services/getChannels';
import getContactedUsers from './services/getContactedUsers';

import revokeToken from './services/revokeToken';

function DirectMessageItem({ to, children, className }) {
  return (
    <Link
      to={to}
      className={cx(className, 'py-[10px] px-[5px] w-full max-w-full hover:bg-tuna-darker')}
    >
      {children}
    </Link>
  );
}

function DirectMessages({ errorHandler, connection }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users: contactedUsers } = useSelector((state) => state.contactedUsers);
  const { channels } = useSelector((state) => state);
  const { occupierInfo: chatOccupierInfo, isAtButton, chatType } = useSelector((state) => state.chat);
  const { loaded, result: contactedUsersResult } = useFetchData(
    getContactedUsers,
    errorHandler,
  );

  const { loaded: channelsFetched, result: channelsResult } = useFetchData(
    getChannels,
    errorHandler,
  );

  const { sendAction: revokeTokenAction } = useApiAction(
    revokeToken,
    errorHandler,
  );

  useEffect(() => {
    if (contactedUsersResult && contactedUsersResult.data) {
      contactedUsersResult.data.forEach(({ contactedUser }) => {
        dispatch(addContactedUser(contactedUser));
      });
    }
  }, [contactedUsersResult]);

  useEffect(() => {
    if (channelsResult && channelsResult.data) {
      channelsResult.data.forEach((channel) => {
        dispatch(addChannel(channel));
      });
    }
  }, [channelsResult]);

  useEffect(() => {
    const callBack = (data) => {
      dispatch(addContactedUser(data.contactedUser));
    };

    connection.on('NewUserContactAdded', callBack);

    return () => connection.off('NewUserContactAdded', callBack);
  }, []);

  useEffect(() => {
    const callBack = (data) => {
      const senderId = data.sender.id;
      const isSenderCurrentlyInMessaging = chatOccupierInfo.userId === senderId;
      if (!isSenderCurrentlyInMessaging) {
        dispatch(highlightUser(senderId));
      }

      if (isSenderCurrentlyInMessaging && !isAtButton) {
        dispatch(highlightUser(senderId));
      }
    };

    connection.on('ReceiveMessage', callBack);

    return () => {
      connection.off('ReceiveMessage', callBack);
    };
  }, [chatOccupierInfo.userId, isAtButton]);

  useEffect(() => {
    const callBack = (data) => {
      const { channel: {id: channelId} } = data;

      if (chatOccupierInfo.channelId !== channelId) {
        dispatch(highlightChannel(channelId));
      }

      if (chatOccupierInfo.channelId === channelId && !isAtButton) {
        dispatch(highlightChannel(channelId));
      }
    };

    connection.on('ReceiveGroupMessage', callBack);

    return () => {
      connection.off('ReceiveGroupMessage', callBack);
    };
  }, [chatOccupierInfo.channelId, chatType, isAtButton]);

  useEffect(() => {
    const callBack = (data) => {
      const {id, name} = data;
      dispatch(addChannel({id, name}));
      dispatch(highlightChannel(id))
    };

    connection.on('UserAddedToChannel', callBack);

    return () => {
      connection.off('UserAddedToChannel', callBack);
    };
  }, []);

  useEffect(() => {
    const callBack = (channel) => {
      const {id} = channel;
      dispatch(removeChannel({id}));
    };

    connection.on('UserRemovedFromChannel', callBack);

    return () => {
      connection.off('UserRemovedFromChannel', callBack);
    };
  }, []);

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
        <div className="mb-[20px]">
          <div className="flex items-center text-left px-[5px]">
            <ReactSVG
              src="http://localhost:5122/public/icons/group.svg"
              beforeInjection={(svg) => {
                svg.setAttribute('width', '24px');
                svg.setAttribute('height', '24px');
              }}
            />
            <span className="ml-[10px] py-[10px]">Channels</span>
          </div>
          <div className="flex flex-col items-start">
            {channels.map(({ name, id, highlighted }) => (
              <DirectMessageItem
                key={id}
                to={`${ROUTES.CHANNEL_CHAT}/${id}`}
                className={highlighted && 'font-extrabold'}
              >
                <span className="break-words">{name}</span>
              </DirectMessageItem>
            ))}
            <DirectMessageItem to={ROUTES.CREATE_CHANNEL}>
              <div className="flex items-center text-left">
                <ReactSVG
                  src="http://localhost:5122/public/icons/add-plus-circle.svg"
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '24px');
                    svg.setAttribute('height', '24px');
                  }}
                />
                <span className="ml-[10px]">Create channel</span>
              </div>
            </DirectMessageItem>
          </div>
        </div>
        <div className="flex items-center text-left px-[5px]">
          <ReactSVG
            src="http://localhost:5122/public/icons/direct-message.svg"
            beforeInjection={(svg) => {
              svg.setAttribute('width', '24px');
              svg.setAttribute('height', '24px');
            }}
          />
          <span className="ml-[10px] py-[10px]">Private messages</span>
        </div>
        <div className="flex items-start flex-col">
          {contactedUsers.map(({
            id, userName, profilePictureId, highlighted,
          }) => (
            <DirectMessageItem
              key={id}
              to={`${ROUTES.DIRECT_MESSAGE}/${id}`}
              className={highlighted && 'font-extrabold'}
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:5122/api/public-file/${profilePictureId}`}
                  width="30px"
                  height="30px"
                  className={cx('rounded-full aspect-square')}
                />
                <p className="ml-[10px]">{userName}</p>
              </div>
            </DirectMessageItem>
          ))}
        </div>
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

export default withErrorWrapper(DirectMessages);
