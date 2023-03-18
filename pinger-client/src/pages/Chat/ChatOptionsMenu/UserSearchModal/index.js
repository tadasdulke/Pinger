import React, { useState, useEffect } from 'react';
import _debounce from 'lodash.debounce'
import { Modal, useFetchData, withErrorWrapper } from '@Common'
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import { searchChatSpaceMembers } from '@Services'
import { changeChatOccupierInfo } from '@Store/slices/chat';
import useAddContactedUser from './hooks/useAddContactedUser';

const Item = ({name, onClick}) => {
    return (
        <button className="pt-[15px]" onClick={onClick}>
            {name}
        </button>
    )
}

const UserSearchModal = ({errorHandler, setShowModal}) => {
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState();
    const { userId} = useSelector(state => state.auth)
    const { loaded, result } = useFetchData(
        async () => await searchChatSpaceMembers(searchInput), //TODO: add debounce
        errorHandler,
        null,
        [searchInput]
    );

    const { addContactedUser } = useAddContactedUser(errorHandler)
    
    const getUsersWithRemovedSelf = () => {
        if(!result || !result.data) {
            return null;
        }

        return result.data.filter(user => user.id !== userId);
    }

    const filteredUsers = getUsersWithRemovedSelf();

    const loadedBody = filteredUsers && filteredUsers.map(({userName, id }) => {
        const onClick = async () => {
            dispatch(changeChatOccupierInfo({
                id,
                userName
            }));
            setShowModal(false);
            await addContactedUser(id)
        }
        return (
            <Item name={userName} onClick={onClick} />
        )
    })

    const loadingBody = null;

    const body = loaded ? loadedBody : loadingBody;

    return (
        <Modal
            className="text-white border rounded-[5px] boder-white bg-tuna top-1/4 left-1/2 translate-x-[-50%] translate-y-[-50%] p-[16px] w-[70%]"
            onClickOutside={() => setShowModal(false)}
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