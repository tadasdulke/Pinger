import React from 'react';
import { ReactSVG } from 'react-svg';

import './index.css'

const FileUploadButton = ({files, uploadFiles}) => {

    const addFiles = (filesToAdd) => {
        const filteredFilesToAdd = [...filesToAdd].filter(({name}) => !files.find(f => f.file.name === name));
        uploadFiles(filteredFilesToAdd);
    }

    return (
        <>
            <label htmlFor="file-upload" className="custom-file-upload">
                <ReactSVG 
                    src="http://localhost:5122/public/icons/add-file.svg" 
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px')
                        svg.setAttribute('height', '24px')
                    }}
                />
            </label>
            <input 
                id="file-upload" 
                type="file"
                multiple
                onChange={(e) => addFiles(e.target.files)}
            />
        </>
    );
}

export default FileUploadButton;