import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import PrivateChat from '..'

import usePrivateMessages from '../hooks/usePrivateMessages';
import { useDispatch } from 'react-redux';
import { useParams, useOutletContext } from 'react-router-dom';

const receiverId = 4;

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

jest.mock('react-router-dom', () => ({
    useParams: () => ({receiverId}),
    useOutletContext: () => ({
        connection: () => ({
            invoke: jest.fn().mockReturnValue(jest.fn()),
            on: jest.fn().mockReturnValue(jest.fn()),
        })
    })
}))

jest.mock('../hooks/usePrivateMessages', () => ({
    __esModule: true,
    default: jest.fn()
}))

describe('PrivateChat', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        window.IntersectionObserver = jest.fn(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
        }))
        Element.prototype.scrollIntoView = jest.fn();
    })

    const mockUsePrivateMessages = () => {
        const modifyMessageMock = jest.fn(); 
        const removeMessageMock = jest.fn(); 
        const handleAdditionalLoadMock = jest.fn(); 
        const setSeeNewMessagesButtonVisibleMock = jest.fn(); 

        usePrivateMessages.mockReturnValue({
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
        mockUsePrivateMessages();

        expect(() => render(
            <PrivateChat/>
        )).not.toThrow();

    });
});