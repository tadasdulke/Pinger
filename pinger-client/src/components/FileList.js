import React from 'react';
import { ReactSVG } from 'react-svg';

const  FileList = ({files, setFiles}) => {
    const removeFile = ({name}) => {
        const filteredFiles = files.filter(file => file.name !== name);
        setFiles(filteredFiles)
    }

    return (
        <div className="pl-[10px] mt-[8px]">
            {files.map(({name}) => (
                <div key={name} className="flex items-center py-[3px]">
                    <ReactSVG 
                        src="http://localhost:5122/public/icons/file.svg" 
                        beforeInjection={(svg) => {
                            svg.setAttribute('width', '24px')
                            svg.setAttribute('height', '24px')
                        }}
                    />
                    <div className="flex justify-between w-full">
                        <button type="button" className="text-white ml-[10px]">{name}</button>
                        <button type="button" onClick={() => removeFile({name})}>
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