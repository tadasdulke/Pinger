import React from 'react';
import { Button } from '@Common';

const RemoveChannelConfirmation = ({cancelAction, removeAction}) => {
    return (
        <div className="w-[300px]">
            <p className="mb-[10px]">Are  you sure you want to remove this channel?</p>
            <p className="mb-[10px]">All messages will be removed.</p>
            <div className="flex items-center justify-between">
            <Button
                color="red"
                onClick={removeAction}
            >
                Remove
            </Button>

            <Button onClick={cancelAction}>Cancel</Button>
            </div>
        </div>
    )
}

export default RemoveChannelConfirmation;