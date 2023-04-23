import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import { useDispatch } from 'react-redux';

import useCreateChannel from '../hooks/useCreateChannel';
import CreateChannel from '..';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

jest.mock('../hooks/useCreateChannel', () => ({
    __esModule: true,
    default: jest.fn()
}))

describe('CreateChannel', () => {
    beforeEach(() => {
        useCreateChannel.mockReturnValue({channelCreated: true, createChannel: jest.fn()});
    })

    it('should render withour errors', () => {
        expect(() => render(<CreateChannel/>)).not.toThrow();
    });

    it('should render input fields', () => {
        const { getByLabelText } = render(
            <CreateChannel/>
        );
        
        expect(getByLabelText("Channel name")).toBeInTheDocument()
        
    });

    it('should indicate fields as required if fields are empty', async () => {
        const { getAllByText, getByRole } = render(
            <CreateChannel/>
        );
        
        const submitButton = getByRole('button', {
            name: /Submit/i
        })
        
        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(getAllByText("Required")).toHaveLength(1);
    });

    it('should show loader instead of submit text in button when channel is being created', async () => {
        useCreateChannel.mockReturnValue({channelCreated: false});

        
        const { queryByText } = render(
            <CreateChannel/>
        );
        
        expect(queryByText("Submit")).not.toBeInTheDocument();
    });

    it('should handle create after submit button click', async () => {
        const channelName = "some channel"
        const channelId = 1;
        const response = { status: 200, data: { id: channelId, name: channelName}}

        const createChannelActioMock = jest.fn();
        useCreateChannel.mockReturnValue({channelCreated: true, createChannel: createChannelActioMock.mockResolvedValue(response)});

        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        const { getByRole, getByLabelText } = render(
            <CreateChannel />
        );
        
        const submitButton = getByRole('button', {
            name: /Submit/i
          })

        const channelNameField = getByLabelText('Channel name')
        
        await act(() => {
            fireEvent.change(channelNameField, {target: {value: channelName}})
            fireEvent.click(submitButton)
        });

        expect(createChannelActioMock).toBeCalledWith(channelName, false);
        expect(createChannelActioMock).toBeCalledTimes(1);
        expect(dispatchMock).toBeCalledTimes(1);
        expect(navigateMock).toBeCalledWith(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${channelId}`)
    });

    it('should do nothing if request response is not 200', async () => {
        const response = { status: 500}

        const createChannelActioMock = jest.fn();
        useCreateChannel.mockReturnValue({channelCreated: true, createChannel: createChannelActioMock.mockResolvedValue(response)});

        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        const { getByRole, getByLabelText } = render(
            <CreateChannel />
        );
        
        const submitButton = getByRole('button', {
            name: /Submit/i
          })

        const channelNameField = getByLabelText('Channel name')
        const channelName = "test";

        await act(() => {
            fireEvent.change(channelNameField, {target: {value: channelName}})
            fireEvent.click(submitButton)
        });

        expect(createChannelActioMock).toBeCalledWith(channelName, false);
        expect(createChannelActioMock).toBeCalledTimes(1);
        expect(dispatchMock).not.toBeCalled();
        expect(navigateMock).not.toBeCalled()
    });
});