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
        const addedMessageCount = 4;

        useMessages.mockReturnValue({
            addMessage: addMessageMock,
            setAddedMessageCount: setAddedMessageCountMock,
            addedMessageCount
        })

        return {
            addMessageMock,
            setAddedMessageCountMock,
            addedMessageCount
        }
    }

    it('should render withour errors', async () => {
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

        const connectionMock = {
            on: async (eventName, callback) => {
                if(eventName === "MessageSent") {
                    await callback(messagePayload);
                }
            },
            off: jest.fn()
        }

        const { result } = renderHook(() => usePrivateMessages(connectionMock, 'receiver id', false))

        expect(addMessageMock).toBeCalledWith(messagePayload)
        expect(setAddedMessageCountMock).toBeCalledWith(addedMessageCount + 1)


    });
});