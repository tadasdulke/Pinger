import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchData } from '@Common'
import ChannelList from '../ChannelList';
import { getUnreadChannelMessages } from '@Services';

jest.mock("@Services", () => ({
    ...jest.requireActual("@Services"),
    getUnreadChannelMessages: jest.fn()
}))

jest.mock("@Common", () => ({
    useFetchData: jest.fn().mockReturnValue({}),
    Loader: () => <div>Loading</div>
}))

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}))

jest.mock('react-router-dom', () => ({
    Link: () => <a/>,
}))

describe('ChannelList', () => {
    beforeEach(() => {
        useSelector.mockReturnValue({
            channels: [],
            currentWorkspaceId: 1,
            occupierInfo: {}, 
            isAtButton: false,
            chatType: null
        })
    })

    const mockConnection = (eventToTarget, data) => {
        const on = (event, callback) => {
            if(event === eventToTarget) {
                callback(data);
            }
        }
        
        return {
            on,
            off: () => {},
        }
    }

    it('should initiate action on ReceiveGroupMessage action', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        const data = {
            channel: {
                id: 4
            }
        }
        const connection = mockConnection("ReceiveGroupMessage", data)

        render(<ChannelList connection={connection} />);
    });

    it('should initiate action on ReceiveGroupMessage action', () => {
        getUnreadChannelMessages.mockResolvedValue({
            data: {
                unreadMessages: [
                    {
                        id:1,
                        body: "hey"
                    }
                ],
            }
        })

        const channel = { 
            id: 4
        }
        
        useFetchData.mockReturnValue({
            result: {
                data: [channel]
            }
        })

        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        const data = {
            channel 
        }
        const connection = mockConnection("ReceiveGroupMessage", data)

        render(<ChannelList connection={connection} />);
    });

    it('should initiate action on UserAddedToChannel action', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        const data = {
            id: 1,
            name: "channel",
            chatSpace: {
                id: 1
            } 
        }
        const connection = mockConnection("UserAddedToChannel", data)

        render(<ChannelList connection={connection} />);

        expect(dispatchMock).toBeCalledTimes(3)
    });
});