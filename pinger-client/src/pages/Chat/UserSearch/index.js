import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';

import UserSearchModal from './UserSearchModal'

const UserSearch = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            {showModal && <UserSearchModal setShowModal={setShowModal} />}
            <button className="text-white text-sm bg-tuna-darker p-[10px] rounded-[5px] flex items-center" onClick={() => setShowModal(true)}>
                <ReactSVG
                    src="http://localhost:5122/public/icons/search.svg"
                    beforeInjection={(svg) => {
                        svg.setAttribute('fill', 'white');
                        svg.setAttribute('width', '20px');
                        svg.setAttribute('height', '20px');
                    }}
                    className="mr-[5px]"
                />
                <span>Search for users or channels</span>
            </button>
        </div>
    )
}

export default UserSearch;