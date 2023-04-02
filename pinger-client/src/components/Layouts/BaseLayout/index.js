import React from 'react';

import './index.css';

function BaseLayout({ children }) {
  return (
    <div className="bg-tuna h-screen">
      {children}
    </div>
  );
}

export default BaseLayout;
