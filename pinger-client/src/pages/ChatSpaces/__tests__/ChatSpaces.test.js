import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import useFetchUserChatSpaces from '../hooks/useFetchUserChatSpaces';
import useAppendClaims from '../hooks/useAppendClaims';

import ChatSpaces from '..';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

jest.mock('../hooks/useFetchUserChatSpaces', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({loaded: false})
}))

jest.mock('../hooks/useAppendClaims', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock("@Common/components/Loader", () => () => {
    return <div>Loading</div>;
});

describe('ChatSpaces', () => {
    const fakeChatSpaces = [
        {
            id: 4,
            name: "first chatspace"
        },
        {
            id: 5,
            name: "second chatspace"
        },
        {
            id: 8,
            name: "third chatspace"
        }
    ]

    beforeEach(() => {
        useDispatch.mockReturnValue(jest.fn());
        useFetchUserChatSpaces.mockReturnValue({
            loaded: true,
            chatSpaces: {
                data: fakeChatSpaces
            }
        })

        useAppendClaims.mockReturnValue({})
    })

    it('should restore states on initial render', () => {
        const dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);

        render(
            <ChatSpaces/>
        );

        expect(dispatchMock).toBeCalledTimes(4)
    });

    it('should show loader if chatspaces are not loaded', () => {
        useFetchUserChatSpaces.mockReturnValue({
            loaded: false,
        })
        const {getByText} = render(
            <ChatSpaces/>
        );

        expect(getByText("Loading")).toBeInTheDocument();
    });

    it('should show all first chatspaces when not expanded', () => {
        const {queryByText} = render(
            <ChatSpaces/>
        );

        const fakeChatSpacesToDisplay = fakeChatSpaces.slice(0,2);
        const fakeChatSpacesNotToDisplay = fakeChatSpaces.slice(2);

        fakeChatSpacesToDisplay.forEach(({name}) => {
            expect(queryByText(name)).toBeInTheDocument();
        })

        fakeChatSpacesNotToDisplay.forEach(({name}) => {
            expect(queryByText(name)).not.toBeInTheDocument();
        })
    });

    it('should show all chatspaces when expended', async () => {
        const { queryByText, getByRole } = render(
            <ChatSpaces />
        );

        const showAllButton = getByRole('button', {
            name: /Show all/i
        })

        await act(() => {
            fireEvent.click(showAllButton)
        });

        fakeChatSpaces.forEach(({name}) => {
            expect(queryByText(name)).toBeInTheDocument();
        })
    });

    it('should initiate worksapce selection action after press on workspace', async () => {
        const addClaimsMock = jest.fn();
        useAppendClaims.mockReturnValue({
            addClaims: addClaimsMock.mockResolvedValue({
                status: 204
            })
        })

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const { getByRole } = render(
            <ChatSpaces />
        );

        const workspaceButton = getByRole('button', {
            name: /first chatspace/i
        })

        await act(() => {
            fireEvent.click(workspaceButton)
        });

        expect(addClaimsMock).toBeCalled();
        expect(navigateMock).toBeCalled();

    });

    it('should do nothing if request failed', async () => {
        const addClaimsMock = jest.fn();
        useAppendClaims.mockReturnValue({
            addClaims: addClaimsMock.mockResolvedValue({
                status: 404
            })
        })


        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const { getByRole } = render(
            <ChatSpaces />
        );

        const workspaceButton = getByRole('button', {
            name: /first chatspace/i
        })

        await act(() => {
            fireEvent.click(workspaceButton)
        });

        expect(addClaimsMock).toBeCalled();
        expect(navigateMock).not.toBeCalled();

    });
});