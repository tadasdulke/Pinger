import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useLoadedImage } from '@Common';
import { ROUTES } from '@Router';
import MessagingOptions from './MessagingOptions';

function UserBar() {
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
            <span className="ml-[16px] break-all">{userName}</span>
          </div>
        </Link>
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
