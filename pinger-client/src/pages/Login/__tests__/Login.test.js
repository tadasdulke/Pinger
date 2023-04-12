import React from 'react';
import { render } from '@testing-library/react';
import Login from '..';

jest.mock("../LoginForm", () => () => {
    return <div/>;
});

describe('Login', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <Login/>
        )).not.toThrow();
    });
});