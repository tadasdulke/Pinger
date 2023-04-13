import { renderHook, waitFor, act } from '@testing-library/react';
 
import useMessages from '../useMessages';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('@Services', () => ({
    searchChatSpaceMembers: jest.fn(),
}));

describe('useMessages', () => {
    const unreadMessages = [
        {
            id: 4,
            body: 'test'
        },
        {
            id: 5,
            body: 'next message'
        }
    ]

    const messages = [
        {
            id: 1,
            body: 'next message'
        },
        {
            id: 3,
            body: 'howdy'
        }
    ]

    const renderHookUseMessageHook = (messages, unreadMessages) => {
        const getMessagesActionMock = jest.fn().mockResolvedValue({
            status: 200,
            data: {
                messages
            }
        });

        const getUnreadMessagesAction = jest.fn().mockResolvedValue({
            status: 200,
            data: {
                unreadMessages
            }
        });
        const receiverId = "receiverId";

        return renderHook(() => useMessages(receiverId, getMessagesActionMock, getUnreadMessagesAction))
    }

    it('should add to messages if no unread messages exists', async () => {
        const {result} = renderHookUseMessageHook(messages, [])

        const newMessage = {
            id: 1,
            body: 'test'
        }

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        await act(() => {
            result.current.addMessage(newMessage);
        });

        waitFor(() => {
            expect(result.current.messages).toEqual([...messages, newMessage])
        })
    });

    it('should add to unread messages if unread messages exists', async () => {
        const {result} = renderHookUseMessageHook(messages, unreadMessages)

        const newMessage = {
            id: 1,
            body: 'test'
        }

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        await act(() => {
            result.current.addMessage(newMessage);
        });

        waitFor(() => {
            expect(result.current.unreadMessages).toEqual([...unreadMessages, newMessage])
        })
    });

    it('should modify messages in messages state', async () => {
        const {result} = renderHookUseMessageHook(messages, unreadMessages)

        const messageToModify = messages[0]

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        const updatedMessage = {
            ...messageToModify,
            body: 'modified'
        }

        await act(() => {
            result.current.modifyMessage(updatedMessage);
        });

        waitFor(() => {
            expect(result.current.messages.find(m => m.id === updatedMessage.id).body).toEqual(updatedMessage.body)
        })
    });

    it('should modify messages in unreadmessage state', async () => {
        const {result} = renderHookUseMessageHook(messages, unreadMessages)

        const messageToModify = unreadMessages[0]

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        const updatedMessage = {
            ...messageToModify,
            body: 'modified'
        }

        await act(() => {
            result.current.modifyMessage(updatedMessage);
        });

        waitFor(() => {
            expect(result.current.unreadMessages.find(m => m.id === updatedMessage.id).body).toEqual(updatedMessage.body)
        })
    });

    it('should remove message in unreadmessages state', async () => {
        const {result} = renderHookUseMessageHook(messages, unreadMessages)

        const messageToRemove = unreadMessages[0]

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        await act(() => {
            result.current.removeMessage(messageToRemove);
        });

        waitFor(() => {
            expect(result.current.unreadMessages.find(m => m.id === messageToRemove.id)).toEqual(undefined)
        })
    });

    it('should remove message in messages state', async () => {
        const {result} = renderHookUseMessageHook(messages, unreadMessages)

        const messageToRemove = messages[0]

        await waitFor(() => {
            expect(result.current.unreadMessages).not.toBeNull();
            expect(result.current.messages).not.toBeNull();
        })

        await act(() => {
            result.current.removeMessage(messageToRemove);
        });

        waitFor(() => {
            expect(result.current.messages.find(m => m.id === messageToRemove.id)).toEqual(undefined)
        })
    });
});