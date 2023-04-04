import React from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';

const Modal = ({ className, children, onClose }) => createPortal(
  <div className="fixed top-0 left-0 w-full h-full">
    <div className={cx('fixed z-10 opacity-100', className)}>
      <div className="flex justify-end">
        <button onClick={onClose}>X</button>
      </div>
      {children}
    </div>
  </div>,
  document.body,
);

export default Modal;
