const handleMessageSending = (
    message, 
    scrollToBottom, 
    setMessageValue, 
    files, 
    sendMessage, 
    setFiles, 
) => {
    const allFilesLoaded = files.every(({ loaded }) => loaded === true);

    if (!allFilesLoaded) {
      return;
    }
    
    const loadedFileIds = files.filter(({ error }) => error === null).map(({ fileId }) => fileId);

    sendMessage(message, loadedFileIds);
    scrollToBottom();
    setFiles([]);
    setMessageValue('');
};

export default handleMessageSending;