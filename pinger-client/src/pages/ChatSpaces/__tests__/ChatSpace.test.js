import React from 'react';
import { render} from '@testing-library/react';

import ChatSpace from '../ChatSpace'

describe('ChatSpace', () => {
    it('should render', () => {
        const name = "test";
        const image = "image";

        const { getByText } = render(
            <ChatSpace name={name} image={image} />
        );
        
        expect(getByText(name)).toBeInTheDocument()
        expect(getByText(image)).toBeInTheDocument()
    });
});