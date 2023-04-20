import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetchChatSpace from './hooks/useFetchChatSpace'
import { changeIsOwner, changeName } from '@Store/slices/workspaces';

const ChatSpaceInformation = () => {
    const { currentWorkspaceId, name } = useSelector(state => state.workspace)
    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const { result } = useFetchChatSpace(currentWorkspaceId);

    useEffect(() => {
        if(result && result.data) {
            const ownerId = result.data.owner.id;
            dispatch(changeIsOwner(ownerId === userId));
            dispatch(changeName(result.data.name));
        }
    }, [result])

    return (
        <div className="flex justify-center items-center text-white px-[20px]">
            <div className="w-[40px] h-[40px] flex justify-center items-center aspect-square rounded-full bg-black ">
                {name?.length > 0 ? name[0].toUpperCase() : ''}
            </div>
            <span className="ml-[16px]">{name}</span>
        </div>
    )
}

export default ChatSpaceInformation;