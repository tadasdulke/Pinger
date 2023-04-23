import React from 'react';
import { render } from '@testing-library/react';

import ManageChatSpaceChannels from '../ManageChatSpaceChannels';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

describe('ManageChatSpaceChannels', () => {
    
    it('should render withour errors', () => {
        expect(() => render(
            <ManageChatSpaceChannels/>
        )).not.toThrow();
    });
});