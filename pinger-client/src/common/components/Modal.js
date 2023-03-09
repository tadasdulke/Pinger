import React from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames'

const Modal = ({className, children}) => {
    return createPortal(
        <div className={cx("fixed z-10", className)}>
            {children}
        </div>,
        document.body
    )
}

export default Modal;