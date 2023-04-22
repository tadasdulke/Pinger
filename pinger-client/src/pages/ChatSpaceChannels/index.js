import React from 'react';
import { Row, Col } from 'react-grid-system';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import { useFetchData, Loader } from '@Common'
import { useSelector } from 'react-redux';
import getAvailableChannels from './services/getAvailableChannels'
import useAddUserToChannel from '../Chat/ChannelChat/hooks/useAddUserToChannel';

const ChannelItem = ({name, id, private: isPrivate}) => {
    const navigate = useNavigate();
    const { userId } = useSelector(state => state.auth)
    const { sendAction: addUserToChannelAction } = useAddUserToChannel(id);

    const onClick = async () => {
        if(isPrivate) {
            navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`)
        }
        else {
            const { status } = await addUserToChannelAction(userId);

            if(status === 204) {
                navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`)
            }
        }
    }

    return (
        <button onClick={onClick} className="p-[10px] text-left hover:bg-tuna flex items-center">
            {name}
        </button>
    )   
}


function ChatSpaceChannels() {
    const { loaded, result: channelsResult } = useFetchData(getAvailableChannels);

    const shouldShowMessage = loaded && channelsResult?.data?.length <= 0;

    return (
        <Row nogutter>
            <Col xs={12} md={8} lg={5}>
                <div className='pt-[30px] px-[30px] min-h-[80%] text-white'>
                    <h1 className="text-3xl mb-[20px]">All channels</h1>
                    <Loader height={30} loaded={loaded}/>
                    <div className="flex flex-col">
                        {channelsResult?.data?.map(channel => <ChannelItem key={channel.id} {...channel} />)}
                    </div>
                    {shouldShowMessage && <p>There are no channels in this chatspace</p>}
                </div>
            </Col>
        </Row>
    );
}

export default ChatSpaceChannels;
