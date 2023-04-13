import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES } from '@Router'
import UserList from '../UserList';
import useAddContactedUser from '../hooks/useAddContactedUser';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

jest.mock('../hooks/useAddContactedUser', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}))

describe('UserList', () => {
    beforeEach(() => {
        const userId = "userId"
        useSelector.mockReturnValue({
            userId
        })

        useAddContactedUser.mockReturnValue({
            addContactedUser: jest.fn()
        })
    })

    it('should render user list', () => {
        const users = [
            {
                id: 4,
                userName: 'Jonas'
            },
            {
                id: 5,
                userName: 'Petras'
            },
        ]

        const { getByText } = render(
            <UserList onClickItem={() => {}} users={users} />
        )

        users.forEach(({userName}) => {
            expect(getByText(userName)).toBeInTheDocument();
        })
    });

    it('should not render members text if no users supplied', () => {
        const { queryByText } = render(
            <UserList />
        )

        expect(queryByText("Members")).not.toBeInTheDocument();
    });

    it('should navigate to user chat after click', async () => {
        const addContactedUserMock = jest.fn()
        useAddContactedUser.mockReturnValue({
            addContactedUser: addContactedUserMock
        })

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock)

        const user = {
            id: 4,
            userName: 'Jonas'
        }  
    
        const onClickMock = jest.fn();

        const { getByText, getByRole } = render(
            <UserList onClickItem={onClickMock} users={[user]} />
        )
        const userButton = getByText(user.userName).closest('button')

        await act(() => {
            fireEvent.click(userButton)
        });

        expect(getByText(user.userName)).toBeInTheDocument();
        expect(onClickMock).toBeCalled();
        expect(navigateMock).toBeCalledWith(`${ROUTES.USE_CHATSPACE}/${ROUTES.DIRECT_MESSAGE}/${user.id}`)
    });
});