import React from 'react';

import './index.css'

const CenteredLayout = ({ children }) => {
    return (
        <div className="bg-tuna h-screen">
            {children}
        </div>
    )
}

export default CenteredLayout;