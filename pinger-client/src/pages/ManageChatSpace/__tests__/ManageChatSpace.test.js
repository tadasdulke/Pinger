import React from 'react';
import { render } from '@testing-library/react';

import ManageChatSpace from '../index'

jest.mock("../ManageChatSpaceInfo", () => ({
    __esModule: true,
    default: () => <div/>
}))

jest.mock("../ManageChatSpaceMembers", () => ({
    __esModule: true,
    default: () => <div/>
}))

jest.mock("../ManageChatSpaceChannels", () => ({
    __esModule: true,
    default: () => <div/>
}))

jest.mock("../InviteMembers", () => ({
    __esModule: true,
    default: () => <div/>
}))

describe('ManageChatSpace', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ManageChatSpace/>
        )).not.toThrow();
    });
});