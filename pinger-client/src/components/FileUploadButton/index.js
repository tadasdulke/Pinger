import React from 'react';
import { ReactSVG } from 'react-svg';
import { FilePicker } from '@Common'

const FileUploadButton = ({files, uploadFiles}) => {
    const addFiles = ({target}) => {
        const filesToAdd = target.files;
        const filteredFilesToAdd = [...filesToAdd].filter(({name}) => !files.find(f => f.file.name === name));
        target.value = '';
        uploadFiles(filteredFilesToAdd);
    }

    return (
        <FilePicker onChange={addFiles}>
            <ReactSVG 
                src="http://localhost:5122/public/icons/add-file.svg" 
                beforeInjection={(svg) => {
                    svg.setAttribute('width', '24px')
                    svg.setAttribute('height', '24px')
                }}
            />
        </FilePicker>
    )
}

export default FileUploadButton;