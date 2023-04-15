import React from 'react';
import { render } from '@testing-library/react';

import ChatSpaceInformation from '../ChatSpaceInformation';
import ChatOptionsMenu from '../ChatOptionsMenu';
import UserSearch from '../UserSearch';

import Chat from '..'

jest.mock('../ChatSpaceInformation', () => ({
    __esModule: true,
    default: () => <div>ChatSpaceInformation</div>
}))

describe('Chat', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <Login/>
        )).not.toThrow();
    });
});