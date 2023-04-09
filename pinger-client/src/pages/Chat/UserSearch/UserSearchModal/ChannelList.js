import React from 'react';
import { useNavigate } from 'react-router-dom'
import {ROUTES} from '@Router'

import ListItem from './ListItem';

const ChannelList = ({channels, onClickItem}) => {
    const navigate = useNavigate();

    const onClick = async (id) => {
        onClickItem && onClickItem();
        navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`)
    }
    
    return (
        <>
            {channels?.length > 0 && <p className="text-white text-center">Channels</p>}
            {channels?.map(({name, id}) => (
                <ListItem key={id} onClick={() => onClick(id)}>
                    {name}
                </ListItem>      
            ))}
        </>
    )
}

export default ChannelList;