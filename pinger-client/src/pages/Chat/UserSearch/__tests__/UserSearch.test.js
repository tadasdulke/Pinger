import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import UserSearch from '..';

jest.mock("../UserSearchModal", () => () => {
    return <div>user search modal</div>;
});

describe('UserSearch', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <UserSearch/>
        )).not.toThrow();
    });

    it('should render placeholder', () => {
        const { getByText } = render(
            <UserSearch/>
        )

        expect(getByText("Search for users or channels")).toBeInTheDocument();
    });

    it('should open modal after click', async () => {
        const { getByText } = render(
            <UserSearch/>
        )

        const activateModalButton = getByText("Search for users or channels").closest('button')
        
        await act(() => {
            fireEvent.click(activateModalButton)
        });
        
        expect(getByText("user search modal")).toBeInTheDocument();
    });
});