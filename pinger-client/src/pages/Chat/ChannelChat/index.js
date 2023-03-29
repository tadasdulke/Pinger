import React, {useEffect, useState} from 'react';
import { useOutletContext, useParams } from 'react-router-dom'
import { ChatWindow } from '@Components'
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchData, withErrorWrapper, useApiAction } from '@Common'
import { DropDown } from '@Components'
import getChannel from './services/getChannel'
import getChannelMessages from './services/getChannelMessages'
import AddUsersToChannel from './components/AddUsersToChannel'
import RemoveUserFromChannel from './components/RemoveUsersFromChannel'
import updateChannelMessageReadTime from './services/updateChannelMessageReadTime'
import { updateChatType, changeChatOccupierInfo, updateIsAtButton } from '@Store/slices/chat';
import { removeChannelHighlight } from '@Store/slices/channels';
import { uploadChannelMessageFile } from '@Services';
import { useUploadPrivateFiles } from '@Hooks'
import removeChannelMessage from './services/removeChannelMessage'
import updateChannelMessage from './services/updateChannelMessage'

const ChannelChat = ({errorHandler}) => {
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);
    const [messages, setMessages] = useState([]);
    const { userId: currentUserId } = useSelector(state => state.auth)
    const [fetchingOptions, setFetchingOptions] = useState({
        step: 50,
        offset: 0,
    });
    const { channelId } = useParams();
    const convertedChannelId = parseInt(channelId)
    const { connection } = useOutletContext();
    const { sendAction: uploadChannelMessageFileAction } = useApiAction(
        (file, channelId) => uploadChannelMessageFile(file, channelId),
    )
    const { sendAction: updateChannelMessageAction } = useApiAction(
        (messageId, body) => updateChannelMessage(messageId, body),
    )
    const { sendAction: removeChannelMessageAction } = useApiAction(
        (messageId) => removeChannelMessage(messageId),
    )
    const { files, uploadFiles, setFiles } = useUploadPrivateFiles(uploadChannelMessageFileAction)

    const sendMessage = (message, scrollToBottom, setMessageValue) => {
        const allFilesLoaded = files.every(({loaded}) => loaded === true);

        if(!allFilesLoaded) {
            return;
        }

        const loadedFileIds = files.filter(({error}) => error === null).map(({fileId}) => fileId);

        connection.invoke("SendGroupMessage", convertedChannelId, message, loadedFileIds)
        scrollToBottom();
        setFiles([]);
        setMessageValue('');
    }
    
    useEffect(() => {
        const callBack = (data) => {
            setMessages([
                ...messages,
                data
            ]);
        }

        connection.on("ReceiveGroupMessage", callBack);

        return () => connection.off("ReceiveGroupMessage", callBack);
    }, [messages])
    
    useEffect(() => {
        const callBack = (data) => {
            setMessages([
                ...messages,
                data
            ]);
        }

        connection.on("GroupMessageSent", callBack);

        return () => connection.off("GroupMessageSent", callBack);
    }, [messages])


    useEffect(() => {
        const callBack = (data) => {
            const messageId = data.id;
            setMessages(messages.filter(message => message.id !== messageId));
        }

        connection.on("RemoveChannelMessage", callBack);

        return () => connection.off("GroupMessageSent", callBack);
    }, [messages])

    useEffect(() => {
        const callBack = data => {
            const modifiedMessages = messages.map(message => {
                if(message.id === data.id) {
                    return data;
                }

                return message;  
            })

            setMessages(modifiedMessages)
        }

        connection.on("ChannelMessageUpdated", callBack);

        return () => connection.off("ChannelMessageUpdated", callBack)
    }, [messages])


    const { loaded, result: channelResponse } = useFetchData(
        () => getChannel(channelId),
        errorHandler,
        null,
        [channelId]
    )
    

    const { result: channelMessagesResult } = useFetchData(
        () => getChannelMessages(channelId, fetchingOptions.offset, fetchingOptions.step),
        errorHandler,
        null,
        [fetchingOptions, channelId]
    )

    useEffect(() => {
        setMessages([])
    }, [channelId])

    useEffect(() => {
        if(channelMessagesResult && channelMessagesResult.data) {
            setMessages([...channelMessagesResult.data, ...messages])
        }

    }, [channelMessagesResult])


    const handleAdditionalLoad = () => {
        setFetchingOptions({
            step: 10,
            offset: fetchingOptions.offset + fetchingOptions.step, 
        })
    }

    const { sendAction: updateReadTime } =  useApiAction(
        () => updateChannelMessageReadTime(convertedChannelId),
        errorHandler
    )

    useEffect(() => {
        dispatch(updateChatType('CHANNEL_CHAT'))
        dispatch(changeChatOccupierInfo({
            channelId: convertedChannelId
        }))
    }, [channelId])


    const onIsAtButtonUpdate = (isAtBottom) => {
        dispatch(updateIsAtButton(isAtBottom))
        dispatch(removeChannelHighlight(convertedChannelId))
    }
    
    const removeMessage = async (messageId) => {
        const { status } = await removeChannelMessageAction(messageId);

        if(status === 204) {
            setMessages(messages.filter(m => m.id !== messageId));
        }
    }

    const handleMessageEdit = async (editedMessage, {id}) => {
        const { status } = await updateChannelMessageAction(id, editedMessage);

        if(status === 204) {
            const modifiedMessages = messages.map(message => {
                if(message.id === id) {
                    return {
                        ...message,
                        body: editedMessage,
                        edited: true,
                    }
                }

                return message;
            })
            setMessages(modifiedMessages);
        }
    }
    
    return ( 
        <ChatWindow
            receiverName={channelResponse?.data?.name}
            messages={messages}
            handleMessageSending={sendMessage}
            removeMessage={removeMessage}
            handleMessageEdit={handleMessageEdit}
            onIsAtButtonUpdate={onIsAtButtonUpdate}
            lazyLoadComponent={
                <button onClick={handleAdditionalLoad}>
                    load more
                </button>
            }
            fileDownloadEndpoint="channel-message-file"
            handleFilesUpload={(addedFiles) => uploadFiles(addedFiles, convertedChannelId)}
            files={files}
            setFiles={setFiles}
            chatActions={
                <>
                    <DropDown
                        expanded={expanded}
                        setExpanded={setExpanded}
                        activationElement={(toggle) => (
                            <button onClick={toggle}>
                                <ReactSVG 
                                    src="http://localhost:5122/public/icons/three-dots-vertical.svg" 
                                    beforeInjection={(svg) => {
                                        svg.setAttribute('width', '24px')
                                        svg.setAttribute('height', '24px')
                                    }}
                                />
                            </button>
                        )}
                        options={[
                            {
                                svg: {
                                    src: "http://localhost:5122/public/icons/add-user.svg"
                                },
                                buttonText: "Add user",
                                componentToRender: <AddUsersToChannel/>
                            },
                            {
                                svg: {
                                    src: "http://localhost:5122/public/icons/add-user.svg"
                                },
                                disabled: channelResponse?.data?.owner?.id !== currentUserId,
                                buttonText: "Remove user",
                                componentToRender: <RemoveUserFromChannel/>
                            },
                        ]}
                    />
                </>
            }
        />
    )
}

export default withErrorWrapper(ChannelChat);