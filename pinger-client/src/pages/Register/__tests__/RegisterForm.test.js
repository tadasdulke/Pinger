import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { Routes, Route, MemoryRouter, useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import RegisterForm from '../RegisterForm';
import { useRegistration } from '../hooks';


jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn()
}))

jest.mock('../hooks', () => ({
    useRegistration: jest.fn()
}));

describe('RegisterForm', () => {
    beforeEach(() => {
        useDispatch.mockReturnValue(() => null);

        const fakeUser = {
            id: 5,
            userName: "doge musk",
            profilePictureId: null
        }

        useRegistration.mockReturnValue(({
            sendAction: jest.fn().mockResolvedValue(({status: 200, data: fakeUser})),
            loaded: true,
        }))
    })

    const renderRegistrationForm = () => (
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route
                    path="/"
                    element={<RegisterForm/>}
                />
            </Routes>
        </MemoryRouter>
    )

    it('should render withour errors', () => {
        expect(() => render(
            renderRegistrationForm()
        )).not.toThrow();
    });

    it('should render input fields', () => {
        const { getByText } = render(
            renderRegistrationForm()
        );
        
        expect(getByText("Username")).toBeInTheDocument()
        expect(getByText("Email")).toBeInTheDocument()
        expect(getByText("Password")).toBeInTheDocument()
        
    });

    it('should indicate fields as required if fields are empty', async () => {
        const { getAllByText, getByRole } = render(
            renderRegistrationForm()
        );
        
        const registerButton = getByRole('button', {
            name: /Sign up/i
          })
        
        await act(() => {
            fireEvent.click(registerButton)
        });

        expect(getAllByText("Required")).toHaveLength(3)
    });

    it('should handle submit after sign up click', async () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
        
        const { getByRole, getByLabelText } = render(
            renderRegistrationForm()
        );
        
        const registerButton = getByRole('button', {
            name: /Sign up/i
        })

        const usernameField = getByLabelText('Username')
        const emailField = getByLabelText('Email')
        const passwordField = getByLabelText('Password')

        await act(() => {
            fireEvent.change(emailField, {target: {value: 'starman@test.com'}})
            fireEvent.change(usernameField, {target: {value: 'star man'}})
            fireEvent.change(passwordField, {target: {value: 'waiting in the sky'}})
            fireEvent.click(registerButton)
        });

        expect(navigateMock).toBeCalledWith(ROUTES.LOGIN)
    });
});