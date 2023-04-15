import React from 'react';
import { render } from '@testing-library/react';
import { useDispatch } from 'react-redux';

import AddUsersToChannel from '../AddUsersToChannel';

import useSearchChatSpaceMembers from '../../hooks/useSearchChatSpaceMembers';
import useChannelMembers from '../../hooks/useChannelMembers';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

const allMembers = [
    {
        id: 1,
        userName: 'test'
    },
]

const membersInChannel = [
    {
        id: 4,
        userName: 'testas'
    }
]

jest.mock('../../hooks/useSearchChatSpaceMembers', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        allChatSpaceMembersResult: {
            data: allMembers
        },
        chatspaceMembersLoaded: true
    })
}))

jest.mock('../../hooks/useChannelMembers', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        channelMembersResult: {
            data: membersInChannel
        },
        channelMembersLoaded: true
    })
}))

describe('AddUsersToChannel', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <AddUsersToChannel/>
        )).not.toThrow();
    });
});