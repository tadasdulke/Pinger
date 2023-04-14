import handleMessageRemove from "../handleMessageRemove";

describe('handleMessageRemove', () => {
  test('should update message and modify if 200 is received', async () => { 
    const message = {
        id: 4,
        body: "test"
    }

    const sendRemoveMessageAction = jest.fn().mockResolvedValue(({
        status: 200,
        data: message
    }));

    const removeMessageMock = jest.fn();

    await handleMessageRemove(message.id, sendRemoveMessageAction, removeMessageMock)

    expect(sendRemoveMessageAction).toBeCalledWith(message.id);
    expect(removeMessageMock).toBeCalledWith(message);
  });

  test('should update message and not modify if 404 is received', async () => { 
    const message = {
        id: 4,
        body: "test"
    }

    const sendRemoveMessageAction = jest.fn().mockResolvedValue(({
        status: 404,
        data: message
    }));

    const removeMessageMock = jest.fn();

    await handleMessageRemove(message.id, sendRemoveMessageAction, removeMessageMock)

    expect(sendRemoveMessageAction).toBeCalledWith(message.id);
    expect(removeMessageMock).not.toBeCalledWith(message);
  });
});
