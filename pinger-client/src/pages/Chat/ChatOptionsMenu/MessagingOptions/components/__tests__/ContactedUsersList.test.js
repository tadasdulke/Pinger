import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchData, useApiAction } from '@Common'

import ContactedUsersList from '../ContactedUsersList';

jest.mock("@Services", () => ({
    ...jest.requireActual("@Services"),
    getUnreadChannelMessages: jest.fn()
}))

jest.mock("@Common", () => ({
    useFetchData: jest.fn().mockReturnValue({}),
    useApiAction: jest.fn().mockReturnValue({}),
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
            users: [],
            occupierInfo: {
                userId: "userId"
            }, 
            isAtButton: false,
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

    it('should add new contacted user after receiving NewUserContactAdded aciton', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)
        const connection = mockConnection("NewUserContactAdded", {})

        render(<ContactedUsersList connection={connection} />);

        expect(dispatchMock).toBeCalledTimes(1)
    });

    it('should highlight contacted user if sender is not active chat ocupier and user is at chat bottom', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        useSelector.mockReturnValue({
            users: [],
            occupierInfo: {
                userId: "userId"
            }, 
            isAtButton: false,
        })

        const data = {
            sender: {
                id: 'userId'
            }
        }

        const connection = mockConnection("ReceiveMessage", data)

        render(<ContactedUsersList connection={connection} />);

        expect(dispatchMock).toBeCalledTimes(1)
    });

    it('should highlight contacted user ', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        useSelector.mockReturnValue({
            users: [],
            occupierInfo: {
                userId: "some other userid"
            }, 
            isAtButton: true,
        })

        const data = {
            sender: {
                id: 'userId'
            }
        }

        const connection = mockConnection("ReceiveMessage", data)

        render(<ContactedUsersList connection={connection} />);

        expect(dispatchMock).toBeCalledTimes(1)
    });

    it('should check for new messages', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock)

        const connection = mockConnection("Unknown action", {})

        useFetchData.mockReturnValue({
            result: {
                data: [
                    {
                        contactedUser: {
                            id: 1,
                            userName: 'test'
                        }
                    }
                ]
            }
        })

        const getUnreadPrivateMessagesMock = jest.fn().mockResolvedValue({
            data: {
                unreadMessages: [
                    {
                        id: 5,
                        body: 'test'
                    }
                ]
            }
        });
        
        useApiAction.mockReturnValue({
            sendAction: getUnreadPrivateMessagesMock
        })

        render(<ContactedUsersList connection={connection} />);

        expect(dispatchMock).toBeCalledTimes(1)
    });
});