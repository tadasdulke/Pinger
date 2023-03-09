import React from 'react';
import { ReactSVG } from 'react-svg';
import UserSearchModal from './UserSearchModal';

const DirectMessageItem = () => (
    <button>
        User Name
    </button>
)

const DirectMessages = () => {

    return (
        <div className="text-white">
            <p className=" text-center">Members</p>
            <DirectMessageItem/>
        </div>
    )
}

const UserBar = () => {

    return (
        <div className="flex justify-between items-center p-[20px]">
            <p className="text-white">
                Tadas
                <UserSearchModal />
            </p>
            <button>
                <ReactSVG
                    src="http://localhost:5122/public/icons/search.svg"
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px')
                        svg.setAttribute('height', '24px')
                        svg.setAttribute('fill', 'white')
                    }}
                />
            </button>
        </div>
    )
}


const ChatOptionsMenu = () => {
    return (
        <div>
            <UserBar/>
            <DirectMessages/>
        </div>
    )
}

export default ChatOptionsMenu;