import React from 'react';
import { render } from '@testing-library/react';
import ChatOptionsMenu from '..';

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockReturnValue({})
}))

jest.mock("../MessagingOptions", () => () => {
    return <div/>;
});

jest.mock('react-router-dom', () => ({
    Link: ({children}) => <a>{children}</a>
}))

describe('ChatOptionsMenu', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ChatOptionsMenu/>
        )).not.toThrow();
    });
});