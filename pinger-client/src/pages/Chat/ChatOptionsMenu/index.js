import React, {useState} from 'react';
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import UserSearchModal from './UserSearchModal';
import DirectMessages from './DirectMessages';

const UserBar = () => {
    const [showModal, setShowModal] = useState(false);
    const { userName } = useSelector(state => state.auth)

    return (
        <div className="flex justify-between items-center p-[20px]">
            <p className="text-white">
                {userName}
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


const ChatOptionsMenu = ({connection}) => {
    return (
        <div>
            <UserBar/>
            <DirectMessages connection={connection}/>
        </div>
    )
}

export default ChatOptionsMenu;