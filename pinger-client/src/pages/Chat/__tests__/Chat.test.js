import React from 'react';
import { render, act } from '@testing-library/react';
import apiClient from '@Api';
import Chat from '..'

jest.mock('../ChatSpaceInformation', () => ({
    __esModule: true,
    default: () => <div>ChatSpaceInformation</div>
}))

jest.mock('../ChatOptionsMenu', () => ({
    __esModule: true,
    default: () => <div>ChatOptionsMenu</div>
}))

jest.mock('../UserSearch', () => ({
    __esModule: true,
    default: () => <div>UserSearch</div>
}))

jest.mock('react-router-dom', () => ({
    Outlet: () => <div>Outlet</div>
}))

jest.mock('@microsoft/signalr', () => ({
    HubConnectionBuilder: jest.fn().mockReturnValue({
        withUrl: () => ({
            build: () => ({
                start: () => {},
                stop: () => {},
                invoke: () => {}
            })
        })
    })
}))

describe('Chat', () => {
    it('should render withour errors', async () => {
        const refreshTokenMock = jest.fn();
        apiClient.refreshToken = refreshTokenMock;

        await act(() => {
            render(<Chat/>);
        })

        expect(refreshTokenMock).toBeCalled();
    });
});