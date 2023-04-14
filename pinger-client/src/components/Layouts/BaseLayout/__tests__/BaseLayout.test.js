import React from 'react';
import { render } from '@testing-library/react';
import BaseLayout from '..';

jest.mock("@Components", () => ({
    ErrorHandler: () => null
}))

describe('BaseLayout', () => {
    it('should render children', () => {
        const children = "Hello"
        const { getByText } = render(<BaseLayout>{children}</BaseLayout>);
        
        expect(getByText(children)).toBeInTheDocument();
    });
});