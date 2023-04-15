const removeFile = (name, setFiles, files) => {
    const filteredFiles = files.filter(({ file }) => file.name !== name);
    setFiles(filteredFiles);
  };

export default removeFile;