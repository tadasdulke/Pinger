import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'

import CreateChatSpace from '../CreateChatSpace';

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn()
}))


describe('CreateChatSpace', () => {
    it('should render without errors', async () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const { getByRole } = render(
                <CreateChatSpace />
        );

        const submitButton = getByRole('button', {
            name: /Create Chatspace/i
        })

        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(navigateMock).toBeCalledTimes(1)
        expect(navigateMock).toBeCalledWith(ROUTES.CREATE_CHATSPACE)
    });
});