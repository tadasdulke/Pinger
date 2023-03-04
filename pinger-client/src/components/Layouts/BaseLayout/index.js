import React from 'react';

import './index.css'

const BaseLayout = ({ children }) => {
    return (
        <div className="bg-tuna h-screen">
            {children}
        </div>
    )
}

export default BaseLayout;