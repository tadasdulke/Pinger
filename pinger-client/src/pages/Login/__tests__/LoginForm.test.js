import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { Routes, Route, MemoryRouter } from 'react-router-dom'

import LoginForm from '../LoginForm';
import { useLogin } from '../hooks';


jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('../hooks', () => ({
    useLogin: jest.fn()
}));

describe('LoginForm', () => {
    beforeEach(() => {
        useDispatch.mockReturnValue(() => null);

        const fakeUser = {
            id: 5,
            userName: "doge musk",
            profilePictureId: null
        }

        useLogin.mockReturnValue(({
            sendAction: jest.fn().mockResolvedValue(({status: 200, data: fakeUser})),
            loaded: true,
        }))
    })

    const renderLoginForm = () => (
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route
                    path="/"
                    element={<LoginForm/>}
                />
            </Routes>
        </MemoryRouter>
    )

    it('should render withour errors', () => {
        expect(() => render(
            renderLoginForm()
        )).not.toThrow();
    });

    it('should render input fields', () => {
        const { getByText } = render(
            renderLoginForm()
        );
        
        expect(getByText("Username")).toBeInTheDocument()
        expect(getByText("Password")).toBeInTheDocument()
        
    });

    it('should indicate fields as required if fields are empty', async () => {
        const { getAllByText, getByRole } = render(
            renderLoginForm()
        );
        
        const loginButton = getByRole('button', {
            name: /Login/i
          })
        
        await act(() => {
            fireEvent.click(loginButton)
        });

        expect(getAllByText("Required")).toHaveLength(2)
    });

    it('should handle submit after login click', async () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        const { getByRole, getByLabelText } = render(
            renderLoginForm()
        );
        
        const loginButton = getByRole('button', {
            name: /Login/i
        })

        const usernameField = getByLabelText('Username')
        const passwordField = getByLabelText('Password')

        await act(() => {
            fireEvent.change(usernameField, {target: {value: 'star man'}})
            fireEvent.change(passwordField, {target: {value: 'waiting in the sky'}})
            fireEvent.click(loginButton)
        });

        expect(dispatchMock).toBeCalledTimes(4)
    });
});