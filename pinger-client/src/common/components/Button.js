import React from 'react';
import cx from 'classnames';

const Button = ({className, ...props}) => (
    <button className={cx("px-[16px] py-[9px] bg-green-600 rounded-[3px] text-white", className)} {...props} />
)

export default Button;