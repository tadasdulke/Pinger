import React from 'react';
import { render } from '@testing-library/react';

import { useSelector, useDispatch } from 'react-redux';
import useFetchChatSpace from '../hooks/useFetchChatSpace';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

jest.mock('../hooks/useFetchChatSpace', () => ({
    __esModule: true,
    default: jest.fn()
}))

import ChatSpaceInformation from '..';

describe('ChatSpaceInformation', () => {
    it('should render fetched chat space info', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)
        const chatSpaceName = "test";
        useFetchChatSpace.mockReturnValue({
            result: {
                data: {
                    name: chatSpaceName,
                    owner: {
                        id: "ownerId"
                    }
                }
            }
        })

        useSelector.mockReturnValue({
            currentWorkspaceId: 1,
            name: "test",
            userId: "userId",
        })

        const { getByText } = render(
            <ChatSpaceInformation/>
        );

        expect(getByText(chatSpaceName)).toBeInTheDocument();
    });
});