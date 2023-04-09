import React from 'react';
import { ReactSVG } from 'react-svg';
import { useSelector, useDispatch } from 'react-redux';
import { removeError } from '../store/slices/errors';

const ErrorHandler = () => {
    const {errors} = useSelector(state => state.errors)
    const dispatch = useDispatch();

    return (
        <div className="absolute bottom-[30px] right-[15px] flex flex-col justify-end">
            {
                errors.map(({id, message}) => (
                    <div key={id} className="bg-red-500 p-[10px] mt-[16px] min-w-[100px] rounded-[5px] flex justify-between items-center z-10">
                        {message}
                        <button
                            className="ml-[10px]"
                            onClick={() => dispatch(removeError(id))}
                        >
                            <ReactSVG
                                src="http://localhost:5122/public/icons/close.svg"
                                beforeInjection={(svg) => {
                                    svg.setAttribute('width', '24px');
                                    svg.setAttribute('height', '24px');
                                }}
                            />
                        </button>
                    </div>
                ))
            }
        </div>
    )
}

export default ErrorHandler;