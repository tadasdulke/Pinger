import React, {useEffect} from 'react';
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel, highlightChannel, removeChannel } from '@Store/slices/channels';
import { useFetchData } from '@Common';
import { getUnreadChannelMessages, getChannels } from '@Services';
import { ROUTES } from '@Router';
import ListItem from './ListItem';


const ChannelList = ({connection}) => {
  const dispatch = useDispatch();

    const { channels } = useSelector((state) => state);
    const { occupierInfo: chatOccupierInfo, isAtButton, chatType } = useSelector((state) => state.chat);
  
    const { result: channelsResult } = useFetchData(
      getChannels,
    );
  
    const checkForUnreadMessages = async (channels) => {
      const unreadMsgs = await Promise.all(channels.map(({id}) => getUnreadChannelMessages(id)));
      unreadMsgs.forEach((unreadMsg, index) => {
        if(unreadMsg.data.length > 0) {
          dispatch(highlightChannel(channels[index].id));
        }
      })
    }

  useEffect(() => {
    if (channelsResult && channelsResult.data) {
      channelsResult.data.forEach((channel) => {
        dispatch(addChannel(channel));
      });

      (async () => {
        await checkForUnreadMessages(channelsResult.data); 
      })();
    }
  }, [channelsResult]);

  useEffect(() => {
    const callBack = (data) => {
      const { channel: {id: channelId} } = data;

      if (chatOccupierInfo.channelId !== channelId) {
        dispatch(highlightChannel(channelId));
      }

      if (chatOccupierInfo.channelId === channelId && !isAtButton) {
        dispatch(highlightChannel(channelId));
      }
    };

    connection.on('ReceiveGroupMessage', callBack);

    return () => {
      connection.off('ReceiveGroupMessage', callBack);
    };
  }, [chatOccupierInfo.channelId, chatType, isAtButton]);

  useEffect(() => {
    const callBack = (data) => {
      const {id, name} = data;
      dispatch(addChannel({id, name}));
      dispatch(highlightChannel(id))
    };

    connection.on('UserAddedToChannel', callBack);

    return () => {
      connection.off('UserAddedToChannel', callBack);
    };
  }, []);


  useEffect(() => {
    const callBack = (channel) => {
      const {id} = channel;
      dispatch(removeChannel({id}));
    };

    connection.on('UserRemovedFromChannel', callBack);

    return () => {
      connection.off('UserRemovedFromChannel', callBack);
    };
  }, []);

    return (
        <div className="mb-[20px]">
          <div className="flex items-center text-left px-[5px]">
            <ReactSVG
              src="http://localhost:5122/public/icons/group.svg"
              beforeInjection={(svg) => {
                svg.setAttribute('width', '24px');
                svg.setAttribute('height', '24px');
              }}
            />
            <span className="ml-[10px] py-[10px]">Channels</span>
          </div>
          <div className="flex flex-col items-start">
            {channels.map(({ name, id, highlighted }) => (
              <ListItem
                key={id}
                to={`${ROUTES.CHANNEL_CHAT}/${id}`}
                className={highlighted && 'font-extrabold'}
              >
                <span className="break-all">{name}</span>
              </ListItem>
            ))}
            <ListItem to={ROUTES.CREATE_CHANNEL}>
              <div className="flex items-center text-left">
                <ReactSVG
                  src="http://localhost:5122/public/icons/add-plus-circle.svg"
                  beforeInjection={(svg) => {
                    svg.setAttribute('width', '24px');
                    svg.setAttribute('height', '24px');
                  }}
                />
                <span className="ml-[10px]">Create channel</span>
              </div>
            </ListItem>
          </div>
        </div>
    )
}

export default ChannelList;