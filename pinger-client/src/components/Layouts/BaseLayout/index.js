import React from 'react';

import { ErrorHandler } from '@Components'

import './index.css';

function BaseLayout({ children }) {
  return (
    <div className="bg-tuna h-screen">
      {children}
      <ErrorHandler/>
    </div>
  );
}

export default BaseLayout;
