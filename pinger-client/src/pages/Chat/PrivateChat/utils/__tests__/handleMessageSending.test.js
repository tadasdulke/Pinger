import handleMessageSending from '../handleMessageSending'

describe('handleMessageSending', () => {
    const sendMessageMock = jest.fn();
    const scrollToBottomMock = jest.fn();
    const setFilesMock = jest.fn();
    const setMessageValueMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should send message when all files laoded', async () => { 
        const message = {
            id: 1,
            body: 'test'
        }

        const files = [
            {
                fileId: 1,
                loaded: true,
                error: null,
            },
            {
                fileId: 2,
                loaded: true,
                error: null
            }
        ]

        handleMessageSending(
            message,
            scrollToBottomMock,
            setMessageValueMock,
            files,
            sendMessageMock,
            setFilesMock
        )

        expect(sendMessageMock).toBeCalledWith(message, [1, 2]);
        expect(scrollToBottomMock).toBeCalledTimes(1);
        expect(setFilesMock).toBeCalledWith([]);
        expect(setMessageValueMock).toBeCalledWith('');
    });
    test('should not send a message when all files are not loaded', async () => { 
        const message = {
            id: 1,
            body: 'test'
        }

        const files = [
            {
                fileId: 1,
                loaded: false,
                error: null,
            },
            {
                fileId: 2,
                loaded: true,
                error: null
            }
        ]

        handleMessageSending(
            message,
            scrollToBottomMock,
            setMessageValueMock,
            files,
            sendMessageMock,
            setFilesMock
        )

        expect(sendMessageMock).not.toBeCalled();
        expect(scrollToBottomMock).not.toBeCalled();
        expect(setFilesMock).not.toBeCalled();
        expect(setMessageValueMock).not.toBeCalled();
    });
});
