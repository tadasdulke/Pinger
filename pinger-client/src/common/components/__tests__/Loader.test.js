import React from 'react';
import { render } from '@testing-library/react';

import Loader from '../Loader'

describe('Loader', () => {
    it('should render without errors', () => {
        expect(() => render(<Loader/>)).not.toThrow();
    });

    it('should should children while loading', () => {

        const children = "Something is still loading"
        const { getByText } = render(<Loader loaded={false}>{children}</Loader>)

        expect(getByText(children)).toBeInTheDocument();
    });
});