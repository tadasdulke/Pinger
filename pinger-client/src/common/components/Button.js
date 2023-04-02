import React from 'react';
import cx from 'classnames';

function Button({ className, color, ...props }) {
  const defaultColorClassName = "bg-green-600";
  const colorClassName = {
    "red": 'bg-red-600',
  }[color] || defaultColorClassName

  return <button className={cx('px-[16px] py-[9px] rounded-[3px] text-white', colorClassName, className)} {...props} />;
}

export default Button;
