import React from 'react';
import cx from 'classnames'
import { RotatingLines } from 'react-loader-spinner';

const Loader = ({className, children, loaded, loaderProps, height}) => {

    const getLoader = () => {
      if(loaded) {
        return null;
      }

      const loader = (
        <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            {...loaderProps}
          />
      )
      
      if(height) {
        return (
          <div className={`flex justify-center items-center h-[${height}px]`}>
            {loader}
          </div>
        )
      }

      if(!children) {
        return loader;
      }

      return (
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            {loader}
        </div>
      )
    }

    return (
        <div className={cx("w-full h-full flex justify-center items-center", className)}>
            {getLoader()}
            {children}
          </div>
    )
}

export default Loader;