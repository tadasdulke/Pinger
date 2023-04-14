import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import useFetchSelf from '../hooks/useFetchSelf';
import useUpdateSelf from '../hooks/useUpdateSelf'

import EditProfile from '..';

jest.mock("../hooks/useFetchSelf", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        self: {}
    })
}))

jest.mock("../hooks/useUpdateSelf", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({})
}))

jest.mock("react-redux", () => ({
    useDispatch: jest.fn()
}))

describe('EditProfile', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <EditProfile/>
        )).not.toThrow();
    });

    it('should render user name edit form', async () => {
        const user = {
            profilePictureId: 1,
            userName: "userName"
        }

        useFetchSelf.mockReturnValue({
            self: {
                data: user
            }
        })

        const { getByText } = render(
            <EditProfile/>
        );

        const inputField = await screen.findByTestId('edit-profile-username-input-id');

        await waitFor(() => expect(inputField).toHaveDisplayValue(user.userName));
    });

    it('should invoke submit action after clicking submit button', async () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const user = {
            profilePictureId: 1,
            userName: "userName"
        }

        useFetchSelf.mockReturnValue({
            self: {
                data: user
            }
        })

        const sendUpdateSelfActionMock = jest.fn().mockResolvedValue({
            status: 200,
            data: user
        })

        useUpdateSelf.mockReturnValue({
            sendUpdateSelfAction: sendUpdateSelfActionMock
        })

        const { getByText, getByLabelText, getByRole } = render(
            <EditProfile/>
        );

        const inputField = await screen.findByTestId('edit-profile-username-input-id');

        await waitFor(() => expect(inputField).toHaveDisplayValue(user.userName));
        
        const submitButton = getByRole('button', {
            name: "Submit"
        })

        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(sendUpdateSelfActionMock).toBeCalledWith(null, user.userName)
        expect(dispatchMock).toHaveBeenCalledTimes(2)
    });
});