import React from 'react';
import { Button } from '@Common'

const Item = ({children, buttonText, onClick}) => {
    return (
        <div className="flex justify-between items-center py-[5px]">
            <div>
                {children}
            </div>
            <Button color="red" onClick={onClick}>
                {buttonText}
            </Button>
        </div>
    )
}

export default Item;