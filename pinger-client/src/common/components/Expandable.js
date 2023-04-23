import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import cx from 'classnames'

const Expandable = ({text, children}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="text-white py-[20px] border-t border-b border-white">
            <div className="flex justify-between items-center px-[30px]">
                <h2 className="text-xl">
                    {text}
                </h2>
                <button 
                    data-testid="expand-button" 
                    onClick={() => setExpanded(!expanded)} 
                    className={cx({"rotate-180": expanded})}
                >
                    <ReactSVG
                        src="http://localhost:5122/public/icons/arrow-down.svg"
                        beforeInjection={(svg) => {
                            svg.setAttribute('width', '20px');
                            svg.setAttribute('height', '20px');
                        }}  
                    />  
                </button>
            </div>
            {expanded && children}
        </div>
    );
}

export default Expandable;