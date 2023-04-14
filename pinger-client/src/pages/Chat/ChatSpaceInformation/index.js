import React from 'react';
import { useSelector } from 'react-redux';
import useFetchChatSpace from './hooks/useFetchChatSpace'

const ChatSpaceInformation = () => {
    const { currentWorkspaceId } = useSelector(state => state.workspace)

    const { result } = useFetchChatSpace(currentWorkspaceId);

    return (
        <div className="flex justify-center items-center text-white px-[20px]">
            <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full bg-black ">
                {result?.data?.name[0].toUpperCase()}
            </div>
            <span className="ml-[16px]">{result?.data?.name}</span>
        </div>
    )
}

export default ChatSpaceInformation;