const handleMessageRemove = async (id, sendRemoveMessageAction, removeMessage) => {
    const { status, data } = await sendRemoveMessageAction(id);

    if (status === 200) {
      removeMessage(data);
    }
};

export default handleMessageRemove;