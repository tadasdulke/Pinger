import React from 'react';
import { render } from '@testing-library/react';

import ButtonWithLoader from '../ButtonWithLoader'

describe('ButtonWithLoader', () => {
    it('should render without errors', () => {
        expect(() => render(<ButtonWithLoader/>)).not.toThrow();
    });
});