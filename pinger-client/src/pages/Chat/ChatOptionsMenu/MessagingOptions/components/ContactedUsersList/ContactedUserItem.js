import React from 'react';
import cx from "classnames"
import { ROUTES } from '@Router'
import { useLoadedImage } from '@Common'
import ListItem from "../ListItem";

const ContactedUserItem = ({id, userName, profilePictureId, highlighted}) => {
    const src = useLoadedImage(
      `http://localhost:5122/api/public-file/${profilePictureId}`,
      'http://localhost:5122/public/profile-pic.png',
    );
  
    return (
      <ListItem
        to={`${ROUTES.DIRECT_MESSAGE}/${id}`}
        className={highlighted && 'font-extrabold'}
      >
        <div className="flex items-center">
          <div className="max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px]">
            {src && <img
              src={src}
              width="100%"
              height="100%"
              className={cx('rounded-full aspect-square')}
            />}
          </div>
          <p className="ml-[10px] break-all">{userName}</p>
        </div>
      </ListItem>
    )
  }

  export default ContactedUserItem;