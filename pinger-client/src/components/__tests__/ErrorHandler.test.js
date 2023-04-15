import React from 'react';
import { render, act, fireEvent, screen} from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorHandler from '../ErrorHandler';


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

describe('ErrorHandler', () => {
    beforeEach(() => {
        const errors = [
            {
                id: "errorId",
                message: "Something is wrong"
            }
        ]

        useSelector.mockReturnValue({
            errors
        })
    })

    it('should render errors from store', () => {
        render(<ErrorHandler/>)
    });

    it('should remove error on click', async () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        render(<ErrorHandler/>)
        
        const svg = screen.getByTestId('remove-error-button')
        await act(() => {
            fireEvent.click(svg)
        });        

        expect(dispatchMock).toBeCalledTimes(1);
    });
});