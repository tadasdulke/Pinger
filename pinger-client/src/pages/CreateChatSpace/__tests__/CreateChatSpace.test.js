import React from 'react';
import { render } from '@testing-library/react';
import CreateChatSpace from '..';

jest.mock("../CreateChatSpaceForm", () => () => {
    return <div/> 
});

describe('CreateChatSpace', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <CreateChatSpace/>
        )).not.toThrow();
    });
});