import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useApiAction } from '@Common';
import { ROUTES } from '@Router'

import MessagingOptions from '..';

jest.mock('@Common', () => ({
    useApiAction: jest.fn()
}))

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn().mockReturnValue({
        isOwner: true
    })
}))

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

jest.mock("../components/ChannelList", () => () => {
    return <div></div>
});

jest.mock("../components/ContactedUsersList", () => () => {
    return <div></div>
});

describe('MessagingOptions', () => {

    const dispatchMock = jest.fn();
    const navigateMock = jest.fn();

    beforeEach(() => {
        useDispatch.mockReturnValue(dispatchMock)
        useNavigate.mockReturnValue(navigateMock)        
        useApiAction.mockReturnValue({})
    })

    it('should render withour errors', () => {
        expect(() => render(
            <MessagingOptions/>
        )).not.toThrow();
    });
    
    it('should trigger logout action on logout button click', async () => {
        const revokeTokenAction = jest.fn().mockResolvedValue({
            status: 204
        });
        
        useApiAction.mockReturnValue({
            sendAction: revokeTokenAction
        })

        const { getByRole } = render(
            <MessagingOptions/>
        )

        const logoutButton = getByRole('button', {
            name: /Logout/i
        })

        await act(() => {
            fireEvent.click(logoutButton)
        });

        expect(revokeTokenAction).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledTimes(2)
        expect(navigateMock).toBeCalledWith(ROUTES.LOGIN)
    });
    
    it('should navigate to chatspace page', async () => {
        const { getByRole } = render(
            <MessagingOptions/>
        )

        const changeChatSpaceButton = getByRole('button', {
            name: /Change chatspace/i
        })

        await act(() => {
            fireEvent.click(changeChatSpaceButton)
        });

        expect(navigateMock).toBeCalledWith(ROUTES.CHATSPACES)
    });
});