import { act, renderHook, waitFor } from '@testing-library/react';

import usePrivateMessages from "../usePrivateMessages";
import { useMessages } from '../../../hooks';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../../hooks', () => ({
    useMessages: jest.fn()
}))


describe('usePrivateMessages', () => {
    const mockUseMessages = () => {
        const addMessageMock = jest.fn();
        const setAddedMessageCountMock = jest.fn();
        const removeMessageMock = jest.fn()
        const modifyMessageMock = jest.fn()
        const addedMessageCount = 4;

        useMessages.mockReturnValue({
            addMessage: addMessageMock,
            setAddedMessageCount: setAddedMessageCountMock,
            addedMessageCount,
            removeMessage: removeMessageMock,
            modifyMessage: modifyMessageMock
        })

        return {
            addMessageMock,
            setAddedMessageCountMock,
            addedMessageCount,
            removeMessageMock,
            modifyMessageMock
        }
    }

    const createConnectionMock = (eventNameToLister, payload) => {
        const connectionMock = {
            on: async (eventName, callback) => {
                if(eventName === eventNameToLister) {
                    await callback(payload);
                }
            },
            off: jest.fn()
        }

        return connectionMock;
    }

    it('should fire action after MessageSent action', async () => {
        const {
            addMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        } = mockUseMessages();

        const messagePayload = {
            receiver: {
                id: 'receiver id'
            }
        }

        const connectionMock = createConnectionMock("MessageSent", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', true))

        expect(addMessageMock).toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).toBeCalledWith(addedMessageCount + 1)
    });


    it('should not fire action after MessageSent action if receiver is not active', async () => {
        const {
            addMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        } = mockUseMessages();

        const messagePayload = {
            receiver: {
                id: 'some other user'
            }
        }

        const connectionMock = createConnectionMock("MessageSent", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(addMessageMock).not.toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).not.toBeCalledWith(addedMessageCount + 1)
    });


    it('should fire event on PrivateMessageUpdated action', async () => {
        const {
            modifyMessageMock
        } = mockUseMessages();

        const messagePayload = {
            sender: {
                id: 'receiver id'
            }
        }

        const connectionMock = createConnectionMock("PrivateMessageUpdated", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(modifyMessageMock).toBeCalledWith(messagePayload)
    });

    it('should not fire event on PrivateMessageUpdated action if sender id is different that receiver', async () => {
        const {
            modifyMessageMock
        } = mockUseMessages();

        const messagePayload = {
            sender: {
                id: 'some other user'
            }
        }

        const connectionMock = createConnectionMock("PrivateMessageUpdated", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(modifyMessageMock).not.toBeCalledWith(messagePayload)
    });

    it('should fire event on PrivateMessageRemoved action', async () => {
        const {
            removeMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        } = mockUseMessages();

        const messagePayload = {
            sender: {
                id: 'receiver id'
            }
        }

        const connectionMock = createConnectionMock("PrivateMessageRemoved", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(removeMessageMock).toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).toBeCalledWith(addedMessageCount - 1)
    });

    it('should not fire event on PrivateMessageRemoved action', async () => {
        const {
            removeMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        } = mockUseMessages();

        const messagePayload = {
            sender: {
                id: 'some other user'
            }
        }

        const connectionMock = createConnectionMock("PrivateMessageRemoved", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(removeMessageMock).not.toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).not.toBeCalledWith(addedMessageCount - 1)
    });

    it('should fire event on ReceiveMessage action', async () => {
        const {
            addMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        } = mockUseMessages();

        const messagePayload = {
            sender: {
                id: 'receiver id'
            }
        }

        const connectionMock = createConnectionMock("ReceiveMessage", messagePayload)

        renderHook(() => usePrivateMessages(connectionMock, 'receiver id', true))

        expect(addMessageMock).toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).toBeCalledWith(addedMessageCount + 1)
    });
});