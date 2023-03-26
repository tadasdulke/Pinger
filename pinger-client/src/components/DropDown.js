import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';

const DropDown = ({activationElement, options, setExpanded, expanded}) => {
    const [currentComponentFunc, setCurrentComponentFunc] = useState(null)

    const toggle = () => setExpanded(!expanded)

    const dropDownOptions = options?.map(({buttonText, svg, action, componentToRender}, index) => (
        <button
            key={index}
            className="flex justify-between text-left w-full rounded-[5px] whitespace-nowrap hover:bg-slate-300 p-[16px] mr-[10px]" 
            onClick={() => action && action(toggle) || setCurrentComponentFunc(componentToRender)}
        >
            {svg && 
                <ReactSVG 
                    src={svg.src} 
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px')
                        svg.setAttribute('height', '24px')
                    }}
                />
            }
            {buttonText}
        </button>
    ));

    const RenderedComponentWrapper = ({children}) => (
        <div className="p-[16px]">
            <button onClick={() => setCurrentComponentFunc(null)}>
                <ReactSVG 
                    src="http://localhost:5122/public/icons/back-arrow.svg" 
                    beforeInjection={(svg) => {
                        svg.setAttribute('width', '24px')
                        svg.setAttribute('height', '24px')
                    }}
                />
            </button>
            {children}
        </div>
    )

    return (
        <div className="relative">
            {activationElement(toggle)}
            {expanded && 
                <div className="absolute top-[50px] right-[0px] bg-white text-black rounded-[5px] z-10">
                    {currentComponentFunc ? <RenderedComponentWrapper>{currentComponentFunc}</RenderedComponentWrapper> : dropDownOptions}
                </div>
            }   
        </div>
    )
}

export default DropDown;