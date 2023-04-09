import React from 'react';
import InputEmoji from 'react-input-emoji';
import { FileUploadButton } from '@Components';

const MessageInput = ({ 
    handleEnter,
    messageValue,
    setMessageValue,
    files,
    handleFilesUpload,
    fileUploadButtonDisabled,
}) => {

    return (
        <div className="flex items-center">
            <InputEmoji
                value={messageValue}
                onChange={setMessageValue}
                cleanOnEnter
                borderRadius={5}
                onEnter={handleEnter}
                placeholder="Type a message"
            />
            {!fileUploadButtonDisabled
                && (
                <FileUploadButton
                    files={files}
                    uploadFiles={handleFilesUpload}
                />
            )}
        </div>   
    )

}

export default MessageInput;