import React from 'react';
import { ReactSVG } from 'react-svg';
import { FilePicker } from '@Common';

import addFiles from './utils/addFiles'

function FileUploadButton({ files, uploadFiles }) {
  return (
    <FilePicker onChange={(target) => addFiles(target, files, uploadFiles)}>
        <ReactSVG 
          src="http://localhost:5122/public/icons/add-file.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('width', '24px');
            svg.setAttribute('height', '24px');
          }}    
        />
    </FilePicker>
  );
}

export default FileUploadButton;
