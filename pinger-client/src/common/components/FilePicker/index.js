import React from 'react';

import './index.css';

function FilePicker({ onChange, children }) {
  return (
    <>
      <label htmlFor="file-upload" className="custom-file-upload">
        {children}
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={onChange}
      />
    </>
  );
}

export default FilePicker;
