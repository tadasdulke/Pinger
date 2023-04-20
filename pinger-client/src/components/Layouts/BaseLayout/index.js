import React from 'react';

import { ErrorHandler } from '@Components'
import { NotificationHandler } from '@Common'

import './index.css';

function BaseLayout({ children }) {
  return (
    <div className="bg-tuna h-screen">
      <NotificationHandler/>
      {children}
      <ErrorHandler/>
    </div>
  );
}

export default BaseLayout;
