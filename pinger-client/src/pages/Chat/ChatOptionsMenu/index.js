import React, {useState} from 'react';
import { ReactSVG } from 'react-svg';
import UserSearchModal from './UserSearchModal';
import DirectMessages from './DirectMessages';

const UserBar = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex justify-between items-center p-[20px]">
            <p className="text-white">
                Tadas
                {showModal && <UserSearchModal setShowModal={setShowModal} />}
            </p>
            <button onClick={() => setShowModal(true)}>
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