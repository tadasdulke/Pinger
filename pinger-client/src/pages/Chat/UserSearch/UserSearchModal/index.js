import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import cx from 'classnames'
import { Modal, Loader } from '@Common';

import UserList from './UserList';
import ChannelList from './ChannelList';
import useFetchChatSpaceMembers from './hooks/useFetchChatSpaceMembers';
import useFetchChannels from './hooks/useFetchChannels';

function UserSearchModal({ setShowModal }) {
  const [searchInput, setSearchInput] = useState('');
  
  const { chatSpaceMembersLoaded, chatSpaceMembersResult } = useFetchChatSpaceMembers(searchInput)

  const { channelsLoaded, channelsResult  } = useFetchChannels(searchInput);

  const loaded = channelsLoaded && chatSpaceMembersLoaded;

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
        {loaded ? (
          <>
            <UserList
              users={chatSpaceMembersResult?.data}
              onClickItem={() => setShowModal(false)}
            />
            <ChannelList
              channels={channelsResult?.data}
              onClickItem={() => setShowModal(false)}
            />
          </>
        ) :
        (
          <Loader className="py-[30px]" />
        )}
      </div>
    </Modal>
  );
}

export default UserSearchModal;
