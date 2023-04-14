import React from 'react';
import { render } from '@testing-library/react';

import FileUploadButton from '..';

describe('FileUploadButton', () => {
    it('should render without errors', () => {
        expect(() => render(<FileUploadButton/>)).not.toThrow();
    });
});