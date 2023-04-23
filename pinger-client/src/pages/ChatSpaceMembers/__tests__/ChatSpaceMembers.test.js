import React from 'react';
import { render } from '@testing-library/react';

import ChatSpaceMembers from '..';

jest.mock('react-redux', () => ({
    useSelector: () => jest.fn().mockReturnValue({
        userId: "userId"
    }),
    useDispatch: jest.fn()
}))

describe('ChatSpaceMembers', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ChatSpaceMembers/>
        )).not.toThrow();
    });
});