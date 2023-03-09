import React, { useState} from 'react';
import _debounce from 'lodash.debounce'
import { Modal, useFetchData, withErrorWrapper } from '@Common'
import { ReactSVG } from 'react-svg';
import { useSelector } from 'react-redux';
import searchChatSpaceMembers from './services/searchChatSpaceMembers'

const Item = ({name}) => {
    return (
        <button className="pt-[15px]">
            {name}
        </button>
    )
}

const UserSearchModal = ({errorHandler}) => {
    const [searchInput, setSearchInput] = useState();
    const { currentWorkspaceId } = useSelector(state => state.workspace)
    const { loaded, result } = useFetchData(
        async () => await searchChatSpaceMembers(currentWorkspaceId, searchInput), //TODO: add debounce
        errorHandler,
        null,
        [searchInput]
    );


    const loadedBody = result && result.data.map(({userName}) => (
        <Item name={userName} />
    ))

    const loadingBody = null;

    const body = loaded ? loadedBody : loadingBody;

    return (
        <Modal
            className="text-white border rounded-[5px] boder-white bg-tuna top-1/4 left-1/2 translate-x-[-50%] translate-y-[-50%] p-[16px] w-[70%]"
        >
            <div className="flex items-center">
                <ReactSVG
                    className="mr-[10px]"
                    src="http://localhost:5122/public/icons/search.svg"
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px')
                        svg.setAttribute('height', '24px')
                        svg.setAttribute('fill', 'white')
                    }}
                />
                <input 
                    autoFocus 
                    type="text" 
                    className="bg-transparent w-full focus:outline-none"
                    placeholder="Type to search for users or groups"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}    
                />
            </div>
            <div>
                {body}
            </div>
        </Modal>
    )
}

export default withErrorWrapper(UserSearchModal);