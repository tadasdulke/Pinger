import React from 'react';
import { useLoadedImage } from '@Common'

import ListItem from './ListItem';

const UserListItem = ({userName, profilePictureId, onClick}) => {
    const src = useLoadedImage(
        `http://localhost:5122/api/public-file/${profilePictureId}`,
        'http://localhost:5122/public/profile-pic.png',
    );

    return (
        <ListItem onClick={onClick} className="flex items-center justify-start">
            <div className="min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px]">
                {src && <img
                    src={src}
                    width="100%"
                    height="100%"
                    className="rounded-full aspect-square"
                />}
            </div>
            <div className="ml-[10px]">
                {userName}
            </div>
        </ListItem>      
    )
}

export default UserListItem;