import React from 'react';
import { Button, Loader } from '@Common';
import { useDispatch } from 'react-redux';
import { removeChannel as removeChannelFromState } from '@Store/slices/channels';

import useDeleteChannel from '../hooks/useDeleteChannel';

const RemoveChannelConfirmation = ({toggle, channelId}) => {
    const dispatch = useDispatch();
    const { channelRemoved, removeChannelAction } = useDeleteChannel();

    const handleChannelRemove = async () => {
        const { status, data } = await removeChannelAction(channelId);

        toggle();
        if(status === 200) {
            dispatch(removeChannelFromState({id: data.id}));
        }
    }

    return (
        <div className="w-[300px]">
            <Loader
                loaded={channelRemoved}
                loaderProps={{
                    strokeColor: "black"
                }}
            >
                <div className="flex flex-col">
                    <p className="mb-[10px]">Are  you sure you want to remove this channel?</p>
                    <p className="mb-[10px]">All messages will be removed.</p>
                    <div className="flex items-center justify-between">
                        <Button
                            color="red"
                            onClick={handleChannelRemove}
                        >
                            Remove
                        </Button>
                        <Button onClick={toggle}>Cancel</Button>
                    </div>
                </div>
      </Loader>
      </div>
    )
}

export default RemoveChannelConfirmation;