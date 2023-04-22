import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-grid-system';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useLoadedImage } from '@Common'
import { ROUTES } from '@Router'
import useSearchChatSpaceMembers from '../Chat/ChannelChat/hooks/useSearchChatSpaceMembers';
import useAddContactedUser from '../Chat/UserSearch/UserSearchModal/hooks/useAddContactedUser';

const MemberItem = ({userName, profilePictureId, id}) => {
    const { addContactedUser } = useAddContactedUser();
    const navigate = useNavigate();
    const src = useLoadedImage(
        `http://localhost:5122/api/public-file/${profilePictureId}`,
        'http://localhost:5122/public/profile-pic.png',
    );

    const onClick = async () => {
        await addContactedUser(id);
        navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.DIRECT_MESSAGE}/${id}`)
    }

    return (
        <button onClick={onClick} className="p-[10px] text-left hover:bg-tuna flex items-center">
            <div className="min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] mr-[16px]">
                {src && <img
                    src={src}
                    width="100%"
                    height="100%"
                    className="rounded-full aspect-square"
                />}
            </div>
            {userName}
        </button>
    )   
}


function ChatSpaceMembers() {
    const [users, setUsers] = useState([]); 
    const { userId } = useSelector(state => state.auth)
    const { allChatSpaceMembersResult } = useSearchChatSpaceMembers();

    useEffect(() => {
        if(allChatSpaceMembersResult?.data) {
            const withoutSelf = allChatSpaceMembersResult?.data.filter(u => u.id !== userId);
            setUsers(withoutSelf)
        }
    }, [allChatSpaceMembersResult])

    return (
        <Row nogutter>
            <Col xs={12} md={8} lg={5}>
                <div className='pt-[30px] px-[30px] min-h-[80%] text-white'>
                    <h1 className="text-3xl mb-[20px]">All users</h1>
                    <div className="flex flex-col">
                        {users.map(user => <MemberItem key={user.id} {...user} />)}
                    </div>
                </div>
            </Col>
        </Row>
    );
}

export default ChatSpaceMembers;
