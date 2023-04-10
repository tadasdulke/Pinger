import React from 'react';
import { Button, useApiAction, Loader } from '@Common';
import { useDispatch } from 'react-redux';
import { removeChannel as removeChannelFromState } from '@Store/slices/channels';

import removeChannel from '../services/removeChannel'

const RemoveChannelConfirmation = ({toggle, channelId}) => {
    const dispatch = useDispatch();
    const { loaded: channelRemoved, sendAction: removeChannelAction } = useApiAction(
        () => removeChannel(channelId),
    );

    const handleChannelRemove = async () => {
        const { status, data } = await removeChannelAction();

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