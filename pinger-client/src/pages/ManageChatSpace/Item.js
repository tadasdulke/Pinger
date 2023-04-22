import React from 'react';
import { Button } from '@Common'

const Item = ({children, buttonText, buttonColor, onClick}) => {
    return (
        <div className="flex justify-between items-center py-[5px]">
            <div>
                {children}
            </div>
            <Button color={buttonColor || "red"} onClick={onClick}>
                {buttonText}
            </Button>
        </div>
    )
}

export default Item;