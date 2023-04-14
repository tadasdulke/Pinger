import React from 'react';
import { render } from '@testing-library/react';

import { useSelector } from 'react-redux';
import useFetchChatSpace from '../hooks/useFetchChatSpace';

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}))

jest.mock('../hooks/useFetchChatSpace', () => ({
    __esModule: true,
    default: jest.fn()
}))

import ChatSpaceInformation from '..';

describe('ChatSpaceInformation', () => {
    it('should render fetched chat space info', () => {
        const chatSpaceName = "test";
        useFetchChatSpace.mockReturnValue({
            result: {
                data: {
                    name: chatSpaceName
                }
            }
        })

        useSelector.mockReturnValue({
            currentWorkspaceId: 1
        })

        const { getByText } = render(
            <ChatSpaceInformation/>
        );

        expect(getByText(chatSpaceName)).toBeInTheDocument();
    });
});