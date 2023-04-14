import handleMessageEdit from '../handleMessageEdit';

describe('handleMessageEdit', () => {
  test('should update message and modify if 200 is received', async () => { 
    const message = {
        id: 4,
        body: "test"
    }

    const sendUpdateMessageActionMock = jest.fn().mockResolvedValue(({
        status: 200,
        data: message
    }));

    const modifyMessageMock = jest.fn();

    await handleMessageEdit(message, {id:message.id}, sendUpdateMessageActionMock, modifyMessageMock)

    expect(sendUpdateMessageActionMock).toBeCalledWith(message.id, message);
    expect(modifyMessageMock).toBeCalledWith(message);
  });

  test('should update message and modify if 500 is received', async () => { 
    const message = {
        id: 4,
        body: "test"
    }

    const sendUpdateMessageActionMock = jest.fn().mockResolvedValue(({
        status: 500,
    }));

    const modifyMessageMock = jest.fn();

    await handleMessageEdit(message, {id:message.id}, sendUpdateMessageActionMock, modifyMessageMock)

    expect(sendUpdateMessageActionMock).toBeCalledWith(message.id, message);
    expect(modifyMessageMock).not.toBeCalled();
  });
});
