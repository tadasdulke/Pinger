const addFiles = ({ target }, files, uploadFiles) => {
    const filesToAdd = target.files;
    const filteredFilesToAdd = [...filesToAdd].filter(({ name }) => !files.find((f) => f.file.name === name));
    target.value = '';
    uploadFiles(filteredFilesToAdd);
};

export default addFiles;