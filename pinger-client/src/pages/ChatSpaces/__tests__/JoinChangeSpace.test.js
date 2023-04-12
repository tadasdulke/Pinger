import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'

import JoinChatSpace from '../JoinChangeSpace';

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn()
}))

describe('JoinChangeSpace', () => {
    it('should render without errors', async () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const { getByRole } = render(
                <JoinChatSpace />
            );

        const submitButton = getByRole('button', {
            name: /Join Chatspace/i
        })

        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(navigateMock).toBeCalledTimes(1)
        expect(navigateMock).toBeCalledWith(ROUTES.JOIN_CHATSPACE)
    });
});