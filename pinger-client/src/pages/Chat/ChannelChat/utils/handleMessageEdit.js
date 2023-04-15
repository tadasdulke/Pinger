const handleMessageEdit = async (editedMessage, { id }, updateChannelMessageAction, modifyMessage) => {
    const { status, data } = await updateChannelMessageAction(id, editedMessage);
    
    if(status === 200) {
      modifyMessage(data);
    }
};

export default handleMessageEdit;