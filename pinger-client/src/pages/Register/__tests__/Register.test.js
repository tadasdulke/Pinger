import React from 'react';
import { render } from '@testing-library/react';
import Register from '..';

jest.mock("../RegisterForm", () => () => {
    return <div/>;
});

describe('Register', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <Register/>
        )).not.toThrow();
    });
});