import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import JoinChatSpace from '..'
import { ROUTES } from '@Router'

import { useFetchAllChatSpaces, useJoinChatSpace, useFetchUserChatSpaces } from '../hooks';

jest.mock('../hooks', () => ({
    useFetchAllChatSpaces: jest.fn(),
    useFetchUserChatSpaces: jest.fn(),
    useJoinChatSpace: jest.fn(),
}))


jest.mock('react-router-dom', () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn()
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  }));

describe('JoinChatSpace', () => {
    it('should render available chatspaces to join', () => {
        const alreadyJoinedChatSpaces = [
            {
                id: 4,
                name: "test"
            },
        ]

        const newChatspaces = [
            {
                id: 1,
                name: "KTU"
            },
            {
                id: 2,
                name: "Work"
            },
        ]

        const allChatSpaces = [
            ...newChatspaces,
            ...alreadyJoinedChatSpaces
        ]

        useFetchAllChatSpaces.mockReturnValue({ allChatSpaces: { data: allChatSpaces} })
        useFetchUserChatSpaces.mockReturnValue({ joinedChatSpaces: { data: alreadyJoinedChatSpaces} })
        useJoinChatSpace.mockReturnValue({ joinChatSpace: jest.fn()})

        const { getByText, queryByText } = render(<JoinChatSpace/>);
        
        newChatspaces.forEach(({name}) => {
            expect(getByText(name)).toBeInTheDocument();
        })
        
        alreadyJoinedChatSpaces.forEach(({name}) => {
            expect(queryByText(name)).not.toBeInTheDocument();
        })
    });

    it('should show info message when all chatspaces are already joined', () => {
        const alreadyJoinedChatSpaces = [
            {
                id: 1,
                name: "KTU"
            },
            {
                id: 2,
                name: "Work"
            },
        ]

        const allChatSpaces = alreadyJoinedChatSpaces

        useFetchAllChatSpaces.mockReturnValue({ allChatSpaces: { data: allChatSpaces} })
        useFetchUserChatSpaces.mockReturnValue({ joinedChatSpaces: { data: alreadyJoinedChatSpaces} })
        useJoinChatSpace.mockReturnValue({ joinChatSpace: jest.fn()})

        const { getByText, queryByText } = render(<JoinChatSpace/>);
        
        expect(getByText("There are no available chatspaces that you can join")).toBeInTheDocument();
        
        allChatSpaces.forEach(({name}) => {
            expect(queryByText(name)).not.toBeInTheDocument();
        })
    });

    it('should show info message when no chatspaces are fetched', () => {
        useFetchAllChatSpaces.mockReturnValue({ allChatSpaces: null })
        useFetchUserChatSpaces.mockReturnValue({ joinedChatSpaces: null })
        useJoinChatSpace.mockReturnValue({ joinChatSpace: jest.fn()})

        const { getByText } = render(<JoinChatSpace/>);
        
        expect(getByText("There are no available chatspaces that you can join")).toBeInTheDocument();
    });
    
    it('should navigate user to chatspace env', async () => {
        const alreadyJoinedChatSpaces = [
            {
                id: 1,
                name: "KTU"
            },
        ]

        useFetchAllChatSpaces.mockReturnValue({ allChatSpaces: {data: alreadyJoinedChatSpaces} })
        useFetchUserChatSpaces.mockReturnValue({ joinedChatSpaces: {data: []} })
        const joinChatSpaceAction = jest.fn().mockResolvedValue({status: 204});
        useJoinChatSpace.mockReturnValue({ joinChatSpace: joinChatSpaceAction})
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
    
        const { getByText } = render(<JoinChatSpace/>);
        
        const chatSpaceButton = getByText(alreadyJoinedChatSpaces[0].name);

        await act(() => {
            fireEvent.click(chatSpaceButton)
        });

        expect(joinChatSpaceAction).toBeCalledTimes(1);
        expect(joinChatSpaceAction).toBeCalledWith(alreadyJoinedChatSpaces[0].id);
        expect(navigateMock).toBeCalledWith(ROUTES.CHATSPACES);
    });
});