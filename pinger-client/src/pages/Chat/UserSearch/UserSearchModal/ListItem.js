import React from 'react';
import cx from 'classnames'

const ListItem = ({ children, onClick, className }) => {
    return (
      <button className={cx(className, "mx-[-16px] px-[16px] py-[10px] text-left hover:bg-tuna-darker")} onClick={onClick}>
        {children}
      </button>
    );
}

export default ListItem; 