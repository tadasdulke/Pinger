import React, { useState } from 'react';
import _debounce from 'lodash.debounce';
import { Modal, useFetchData, withErrorWrapper } from '@Common';
import { ReactSVG } from 'react-svg';
import cx from 'classnames'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import {ROUTES} from '@Router'
import { searchChatSpaceMembers, getChannels } from '@Services';
import useAddContactedUser from './hooks/useAddContactedUser';

function Item({ name, onClick }) {
  return (
    <button className="mx-[-16px] px-[16px] py-[10px] text-left hover:bg-tuna-darker" onClick={onClick}>
      {name}
    </button>
  );
}

function UserSearchModal({ errorHandler, setShowModal }) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const { userId } = useSelector((state) => state.auth);
  
  const { loaded, result } = useFetchData(
    async () => await searchChatSpaceMembers(searchInput),
    errorHandler,
    null,
    [searchInput],
  );

  const { result: channelsResult  } = useFetchData(
    async () => searchInput && await getChannels(searchInput),
    errorHandler,
    null,
    [searchInput],
  );

  const { addContactedUser } = useAddContactedUser(errorHandler);

  const getUsersWithRemovedSelf = () => {
    if (!result || !result.data) {
      return null;
    }

    return result.data.filter((user) => user.id !== userId);
  };

  const filteredUsers = getUsersWithRemovedSelf();

  const userList = filteredUsers && filteredUsers.map(({ userName, id }) => {
    const onClick = async () => {
      setShowModal(false);
      /// add check
      await addContactedUser(id);
      navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.DIRECT_MESSAGE}/${id}`)
    };
    return (
      <Item key={id} name={userName} onClick={onClick} />
    );
  });

  const channelList = channelsResult && channelsResult.data.map(({ name, id }) => {
    const onClick = async () => {
      setShowModal(false);
      navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`)
    };
    return (
      <Item key={id} name={name} onClick={onClick} />
    );
  });

  return (
    <Modal
      className="text-white border rounded-[5px] boder-white bg-tuna top-1/4 left-1/2 translate-x-[-50%] p-[16px] w-[70%]"
      onClose={() => setShowModal(false)}
    >
      <div className="flex items-center">
        <ReactSVG
          className="mr-[10px]"
          src="http://localhost:5122/public/icons/search.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('width', '24px');
            svg.setAttribute('height', '24px');
            svg.setAttribute('fill', 'white');
          }}
        />
        <input
          autoFocus
          type="text"
          className="bg-transparent w-full focus:outline-none"
          placeholder="Type to search for users or groups"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
      </div>
      <div className={cx("flex flex-col mt-[10px]")}>
        {filteredUsers?.length > 0 && <p className="text-white text-center">Members</p>}
        {userList}
        {channelsResult?.data?.length > 0 && <p className="text-white text-center">Channels</p>}
        {channelList}
      </div>
    </Modal>
  );
}

export default withErrorWrapper(UserSearchModal);
