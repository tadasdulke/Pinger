import { useState } from 'react';
import { useApiAction } from '@Common';
import { uploadPrivateFile } from '@Services';

const useUploadPrivateFiles = () => {
    const { sendAction } = useApiAction(
        (file, receiverId) => uploadPrivateFile(file, receiverId),
    )
    
    const [files, setFiles] = useState([]);

    const updateFile = (fileToUpdate) => {
        setFiles(currentFiles => {

            return currentFiles.map((file) => {
                if(file.file.name === fileToUpdate.file.name) {
                    return fileToUpdate
                }
                return file;
            })
        }
        )
    }

    const handleFileUpload  = async ({file}, receiverId) => {
        const { status, data } = await sendAction(file, receiverId);

        if(status === 200) {
            const { id } = data;

            return {
                file,
                loaded: true,
                error: false,
                fileId: id,
            }
        }
        
        return {
            file,
            loaded: true,
            error: "Failed to upload",
            fileId: null
        }
    }

    const uploadFiles = async (filesToUpload, receiverId) => {
        const transformedFiles = filesToUpload.map(file => ({
            file,
            loaded: false,
            error: false,
            fileId: null,
        }))

        setFiles([...files, ...transformedFiles]);

        transformedFiles.map((item) => handleFileUpload(item, receiverId)).forEach(async(promise) => {
            const file = await promise;
            updateFile(file)
        })
    }

    return {
        uploadFiles,
        files,
    }
}

export default useUploadPrivateFiles;