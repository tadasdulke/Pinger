import React from 'react';
import cx from 'classnames'
import { Link } from 'react-router-dom';

const ListItem = ({ to, children, className }) => {
    return (
      <Link
        to={to}
        className={cx(className, 'py-[10px] px-[5px] w-full max-w-full hover:bg-tuna-darker')}
      >
        {children}
      </Link>
    );
}

export default ListItem;