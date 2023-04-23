import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';

import ManageChatSpaceMembers from '../ManageChatSpaceMembers'
import useFetchChatSpaceMembers from '../../Chat/UserSearch/UserSearchModal/hooks/useFetchChatSpaceMembers';
import { useDispatch } from 'react-redux';

jest.mock('../../Chat/UserSearch/UserSearchModal/hooks/useFetchChatSpaceMembers', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        chatSpaceMembersLoaded: true, 
        chatSpaceMembersResult: {
            data: []
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


describe('ManageChatSpaceMembers', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ManageChatSpaceMembers/>
        )).not.toThrow();
    });
    
    it('should remove user', async () => {
        const chatSpacesMembers = [
            {
                id: 1,
                userName: "Jonas"
            }
        ]

        useFetchChatSpaceMembers.mockReturnValue({
            chatSpaceMembersLoaded: true, 
            chatSpaceMembersResult: {
                data: chatSpacesMembers
            }
        })

        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const { getByRole } = render(<ManageChatSpaceMembers/>);

        const svg = screen.getByTestId('expand-button')
        await act(() => {
            fireEvent.click(svg)
        });     

        const removeButton = getByRole('button', {
            name: /Remove/i
        })

        waitFor(() => {
            expect(removeButton).toBeInTheDocument()
        })

        await act(() => {
            fireEvent.click(removeButton)
        });

        expect(dispatchMock).toBeCalled();
    });
});