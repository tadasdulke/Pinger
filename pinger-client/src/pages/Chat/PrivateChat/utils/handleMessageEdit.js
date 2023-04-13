const handleMessageEdit = async (message, { id }, sendUpdateMessageAction, modifyMessage) => {
    const editedMessage = message;
    const { status, data } = await sendUpdateMessageAction(id, editedMessage);

    if (status === 200) {
      modifyMessage(data)
    }
};

export default handleMessageEdit;