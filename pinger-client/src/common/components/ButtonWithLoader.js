import React from 'react';
import { RotatingLines } from 'react-loader-spinner';
import cx from 'classnames'
import { Button } from '@Common'

const ButtonWithLoader = ({loaded, className, onClick, children, ...restProps}) => {
    return (
        <Button className={cx('w-auto min-w-[200px] flex justify-center', className)} onClick={onClick} {...restProps}>
        {!loaded
            ? (
                <RotatingLines
                    strokeColor="white"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="24"
                />
            )
            : children
        }
        </Button>
    )
}

export default ButtonWithLoader;