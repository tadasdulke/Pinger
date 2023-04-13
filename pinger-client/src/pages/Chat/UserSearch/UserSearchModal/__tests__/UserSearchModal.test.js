import React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';

import UserSearchModal from '..';
import useFetchChatSpaceMembers from '../hooks/useFetchChatSpaceMembers';
import useFetchChannels from '../hooks/useFetchChannels';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn().mockReturnValue(jest.fn())
}))

jest.mock('../hooks/useFetchChatSpaceMembers', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('../hooks/useFetchChannels', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

jest.mock("@Common/components/Loader", () => () => {
    return <div>Loading</div>;
});

describe('UserSearchModal', () => {
    beforeEach(() => {
        const userId = "userId"
        useSelector.mockReturnValue({
            userId
        })
    })

    it('should show loader if data is being loaded', () => {
        useFetchChatSpaceMembers.mockReturnValue({
            chatSpaceMembersLoaded: false
        })

        useFetchChannels.mockReturnValue({
            channelsLoaded: false
        })

        const { getByText } = render(
            <UserSearchModal />
        )

        expect(getByText("Loading")).toBeInTheDocument();
    });

    it('should show users and channels', async () => {
        const setShowModalMock = jest.fn();

        useFetchChatSpaceMembers.mockReturnValue({
            chatSpaceMembersLoaded: true,
            chatSpaceMembersResult: {
                data: [
                    {
                        id: 4,
                        userName: 'userName'
                    }
                ]
            }
        })

        useFetchChannels.mockReturnValue({
            channelsLoaded: true,
            channelsResult: {
                data: [
                    {
                        id: 4,
                        name: 'channel'
                    }
                ]
            }
        })

        const { getByText } = render(
            <UserSearchModal setShowModal={setShowModalMock} />
        )

        expect(getByText("userName")).toBeInTheDocument();
        expect(getByText("channel")).toBeInTheDocument();

        const userButton = getByText("userName").closest('button')
        const channelButton = getByText("channel").closest('button')
        const svg = screen.getByTestId('modal-close-button-id')
        
        await act(() => {
            fireEvent.click(userButton)
            fireEvent.click(channelButton)
            fireEvent.click(svg)
        });


        expect(setShowModalMock).toBeCalledWith(false);
        expect(setShowModalMock).toBeCalledTimes(3);

    });
});