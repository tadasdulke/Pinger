import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { useFetchChannel, useEditChannel } from '../hooks';

import EditChannel from '..';

jest.mock('../hooks', () => ({
    useFetchChannel: jest.fn(),
    useEditChannel: jest.fn()
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn()
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe('EditChannel', () => {
    it('should render with name field', () => {
        useEditChannel.mockReturnValue(({channelEdited: true}))
        useFetchChannel.mockReturnValue(({channelLoaded: true}))

        const { getByLabelText } = render(<EditChannel/>);

        expect(getByLabelText("Channel name")).toBeInTheDocument();
    });
    
    it('should render required text if name is not entered', async () => {
        useEditChannel.mockReturnValue(({channelEdited: true}))
        useFetchChannel.mockReturnValue(({channelLoaded: true}))

        const { getAllByText, getByRole } = render(<EditChannel/>);

        const submitButton = getByRole('button', {
            name: /Submit/i
          })
        
        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(getAllByText("Required")).toHaveLength(1);
    });

    it('should render required text if name is not entered', async () => {
        useEditChannel.mockReturnValue(({channelEdited: true}))
        useFetchChannel.mockReturnValue(({channelLoaded: true}))

        const { getAllByText, getByRole } = render(<EditChannel/>);

        const submitButton = getByRole('button', {
            name: /Submit/i
          })
        
        await act(() => {
            fireEvent.click(submitButton)
        });

        expect(getAllByText("Required")).toHaveLength(1);
    });

    it('should invoke channel edit actions after submit aciton', async () => {
        const editChannelActionMock = jest.fn().mockResolvedValue(({status: 200, data: {}}))

        useEditChannel.mockReturnValue(({channelEdited: true, editChannelAction: editChannelActionMock}))
        useFetchChannel.mockReturnValue(({channelLoaded: true, channelResult: {data: { name: "test"}}}))

        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
        
        const { getByRole, getByLabelText } = render(<EditChannel/>);

        const userNameField = getByLabelText("Channel name");

        const submitButton = getByRole('button', {
            name: /Submit/i
          })
        
        await act(() => {
            fireEvent.change(userNameField, {target: {value: 'new user name'}})
            fireEvent.click(submitButton)
        });

        expect(editChannelActionMock).toBeCalledTimes(1)
        expect(dispatchMock).toBeCalledTimes(1)
        expect(navigateMock).toBeCalledTimes(1)
    });
});