import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useLoadedImage } from '@Common';
import { ROUTES } from '@Router';
import UserSearchModal from './UserSearchModal';
import MessagingOptions from './MessagingOptions';

function UserBar() {
  const [showModal, setShowModal] = useState(false);
  const { userName, profilePictureId } = useSelector((state) => state.auth);
  const src = useLoadedImage(
    `http://localhost:5122/api/public-file/${profilePictureId}`,
    'http://localhost:5122/public/profile-pic.png',
  );

  return (
    <div className="flex justify-between items-center p-[20px]">
        <Link to={`${ROUTES.USE_CHATSPACE}/${ROUTES.EDIT_PROFILE}`}>
          <div className="flex items-center text-white">
            <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
              {src && (
              <img
                src={src}
                width="100%"
                height="100%"
                className={cx('rounded-full aspect-square')}
              />
              )}
            </div>
            <span className="ml-[16px]">{userName}</span>
          </div>
        </Link>
        {showModal && <UserSearchModal setShowModal={setShowModal} />}
      <button onClick={() => setShowModal(true)}>
        <ReactSVG
          src="http://localhost:5122/public/icons/search.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('width', '24px');
            svg.setAttribute('height', '24px');
            svg.setAttribute('fill', 'white');
          }}
        />
      </button>
    </div>
  );
}

function ChatOptionsMenu({ connection }) {
  return (
    <div className="h-full flex flex-col">
      <UserBar />
      <MessagingOptions connection={connection} />
    </div>
  );
}

export default ChatOptionsMenu;
