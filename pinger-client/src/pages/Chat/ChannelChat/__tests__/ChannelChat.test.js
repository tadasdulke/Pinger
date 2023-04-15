import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import useChannelMessages from '../hooks/useChannelMessages';
import ChannelChat from '..';

const channelId = 4;

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn().mockResolvedValue({
        userId: "userId"
    })
}))

jest.mock('react-router-dom', () => ({
    useParams: () => ({channelId}),
    useOutletContext: jest.fn().mockReturnValue({
        connection: {
            on: () => {},
            off: () => {},
            invoke: () => {},

        }
    }),
    useNavigate: jest.fn()
}))

jest.mock('../hooks/useChannelMessages', () => ({
    __esModule: true,
    default: jest.fn()
}))

describe('ChannelChat', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        window.IntersectionObserver = jest.fn(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
        }))
        Element.prototype.scrollIntoView = jest.fn();
    })

    const mockuseChannelMessages = () => {
        const modifyMessageMock = jest.fn(); 
        const removeMessageMock = jest.fn(); 
        const handleAdditionalLoadMock = jest.fn(); 
        const setSeeNewMessagesButtonVisibleMock = jest.fn(); 

        useChannelMessages.mockReturnValue({
            messages: [],
            unreadMessages: [],
            modifyMessage: modifyMessageMock,
            removeMessage: removeMessageMock,
            handleAdditionalLoad: handleAdditionalLoadMock,
            initialMessagesLoaded: true,
            hasMore: false,
            additionalMessagesLoading: false,
            setSeeNewMessagesButtonVisible: setSeeNewMessagesButtonVisibleMock,
            seeNewMessagesButtonVisible: false
        })

        return {
            modifyMessageMock,
            removeMessageMock,
            handleAdditionalLoadMock
        }
    }

    it('should render on first render', async () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        mockuseChannelMessages();

        expect(() => render(
            <ChannelChat/>
        )).not.toThrow();

    });
});