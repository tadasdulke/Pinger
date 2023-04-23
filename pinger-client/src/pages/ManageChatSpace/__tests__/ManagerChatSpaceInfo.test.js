import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';

import { useDispatch } from 'react-redux';

import ManageChatSapceInfo from '../ManageChatSpaceInfo';
import useFetchChatSpace from '../../Chat/ChatSpaceInformation/hooks/useFetchChatSpace';

jest.mock('../../Chat/ChatSpaceInformation/hooks/useFetchChatSpace', () => ({
    __esModule: true,
    default: () => jest.fn().mockReturnValue({
        result: {
            data: {
                name: "test"
            }
        }
    })
}))

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn().mockReturnValue({
        userId: "userId"
    })
}))

jest.mock('../../../common/hooks/useApiAction', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        sendAction: jest.fn().mockResolvedValue({
            status: 200
        })
    })
}))


describe('ManageChatSapceInfo', () => {
    it('should render', async () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const { getByRole } = render(<ManageChatSapceInfo />);

        const svg = screen.getByTestId('expand-button')
        await act(() => {
            fireEvent.click(svg)
        });     

    });
});