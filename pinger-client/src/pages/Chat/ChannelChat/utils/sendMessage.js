const sendMessage = (
    message, 
    scrollToBottom, 
    setMessageValue,
    files,
    connection,
    setFiles,
    convertedChannelId
) => {
    const allFilesLoaded = files.every(({ loaded }) => loaded === true);

    if (!allFilesLoaded) {
      return;
    }

    const loadedFileIds = files.filter(({ error }) => error === null).map(({ fileId }) => fileId);

    connection.invoke('SendGroupMessage', convertedChannelId, message, loadedFileIds);
    scrollToBottom();
    setFiles([]);
    setMessageValue('');
};

export default sendMessage;