import React from 'react';
import cx from 'classnames'
import { RotatingLines } from 'react-loader-spinner';

const Loader = ({className, loaderProps}) => {
    return (
        <div className={cx("w-full h-full flex justify-center items-center", className)}>
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="30"
              {...loaderProps}
            />
          </div>
    )
}

export default Loader;