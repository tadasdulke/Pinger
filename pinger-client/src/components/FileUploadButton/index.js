import React from 'react';
import { ReactSVG } from 'react-svg';

import './index.css'

const FileUploadButton = ({files, setFiles}) => {
    const addFiles = (filesToAdd) => {
        const filteredFiles = [...filesToAdd].filter(({name}) => !files.find(f => f.name === name));
        setFiles([...files, ...filteredFiles])
    }

    return (
        <>
            <label for="file-upload" class="custom-file-upload">
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