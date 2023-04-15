import React from 'react';
import { render } from '@testing-library/react';

import { useSelector } from 'react-redux';

import Message from '../Message'

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockReturnValue({
        userId: "userId"
    })
}))

describe('Message', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <Message
                sender={{
                    id: "senderId"
                }}
            />
        )).not.toThrow();
    });
});