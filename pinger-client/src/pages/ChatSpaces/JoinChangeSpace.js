import React from 'react';
import { ReactSVG } from 'react-svg';

import ChatSpace from './ChatSpace';

const JoinChatSpace = () => {
    return (
        <ChatSpace
            name="Join Chatspace"
            className="p-[1rem]"
            image={
                <ReactSVG
                    src="http://localhost:5122/public/icons/people.svg"
                    beforeInjection={(svg) => {
                        svg.setAttribute('height', '100%')
                        svg.setAttribute('width', '100%')
                        svg.setAttribute('fill', 'white')
                    }}
                />
            }
        />
    )
}

export default JoinChatSpace;