import { useState } from 'react';

const useUploadPrivateFiles = (uploadAction) => {
  const [files, setFiles] = useState([]);

  const updateFile = (fileToUpdate) => {
    setFiles((currentFiles) => currentFiles.map((file) => {
      if (file.file.name === fileToUpdate.file.name) {
        return fileToUpdate;
      }
      return file;
    }));
  };

  const handleFileUpload = async ({ file }, relatedUsersData) => {
    const { status, data } = await uploadAction(file, relatedUsersData);

    if (status === 200) {
      const { id } = data;

      return {
        file,
        loaded: true,
        error: null,
        fileId: id,
      };
    }

    return {
      file,
      loaded: true,
      error: data.errorMessage || 'Failed to upload',
      fileId: null,
    };
  };

  const uploadFiles = async (filesToUpload, relatedUsersData) => {
    const transformedFiles = filesToUpload.map((file) => ({
      file,
      loaded: false,
      error: null,
      fileId: null,
    }));

    setFiles([...files, ...transformedFiles]);

    transformedFiles.map((item) => handleFileUpload(item, relatedUsersData)).forEach(async (promise) => {
      const file = await promise;
      updateFile(file);
    });
  };

  return {
    uploadFiles,
    files,
    setFiles,
  };
};

export default useUploadPrivateFiles;
