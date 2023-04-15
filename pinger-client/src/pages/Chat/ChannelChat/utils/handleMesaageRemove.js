const handleMesaageRemove = async (messageId, removeChannelMessageAction, removeMessage) => {
    const { status, data } = await removeChannelMessageAction(messageId);

    if(status === 200) {
      removeMessage(data);
    }
};

export default handleMesaageRemove;