import React from 'react';
import { ReactSVG } from 'react-svg';
import cx from 'classnames'

const  FileList = ({files, setFiles}) => {
    const removeFile = (name) => {
        const filteredFiles = files.filter(({file}) => file.name !== name);
        setFiles(filteredFiles)
    }

    return (
        <div className="pl-[10px] mt-[8px]">
            {files.map(({file, loaded, error, fileId}) => (
                <div key={file.name} className="flex items-center py-[3px]">
                    <div className="self-start">
                        <ReactSVG 
                            src="http://localhost:5122/public/icons/file.svg" 
                            beforeInjection={(svg) => {
                                svg.setAttribute('width', '24px')
                                svg.setAttribute('height', '24px')
                            }}
                        />
                    </div>
                    <div className="flex justify-between w-full">
                        <button type="button" disabled={!fileId} className="ml-[10px] text-left">
                            {fileId ? 
                                <a key={fileId} href={`http://localhost:5122/api/private-message-file/${fileId}`} target="_blank" download={file.name} className={cx("text-white mr-[10px] break-all")}>{file.name}</a>   
                                :
                                <span className="text-white mr-[10px] break-all">{file.name}</span>
                            }
                            {!loaded && 
                                (
                                    <span className="ml">
                                        Uploading
                                    </span>
                                )
                            }
                            {error && (
                                <span className="text-red-600 break-words">
                                    {error}
                                </span>
                            )}
                        </button>
                        <button type="button" onClick={() => removeFile(file.name)}>
                            <ReactSVG 
                                src="http://localhost:5122/public/icons/cross-small.svg" 
                                beforeInjection={(svg) => {
                                    svg.setAttribute('width', '24px')
                                    svg.setAttribute('height', '24px')
                                }}
                            />
                        </button>
                    </div>
                </div>
            ))}
        </div> 
    )
}


export default FileList;