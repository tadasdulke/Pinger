import React from 'react';
import { render } from '@testing-library/react';

import ChatSpaceChannels from '..';

jest.mock('react-redux', () => ({
    useSelector: () => jest.fn().mockReturnValue({
        userId: "userId"
    }),
    useDispatch: jest.fn()
}))

describe('ChatSpaceChannels', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ChatSpaceChannels/>
        )).not.toThrow();
    });
});