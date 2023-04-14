import React from 'react';
import { render } from '@testing-library/react';

import ContactedUserItem from '../ContactedUsersList/ContactedUserItem';

jest.mock('react-router-dom', () => ({
    Link: ({children}) => <a>{children}</a>,
}))

describe('ContactedUserItem', () => {
    it('should render withour errors', () => {
        expect(() => render(
            <ContactedUserItem/>
        )).not.toThrow();
    });
});