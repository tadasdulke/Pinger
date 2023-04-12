import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { ROUTES } from '@Router'
import { createMemoryHistory } from 'history';
import { MemoryRouter, Routes, Route, Router } from 'react-router-dom'

import UnauthorizedRoute from '../UnauthorizedRoute';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('UnauthorizedRoute', () => {
  it('renders children when unauthenticated', () => {
    const mockState = { isAuthenticated: false };
    useSelector.mockReturnValue(mockState);

    const expectedChildren = "only unauthenticated users can see me";

    const { getByText } = render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route
                    path="/"
                    element={<UnauthorizedRoute>{expectedChildren}</UnauthorizedRoute>}
                />
            </Routes>
        </MemoryRouter>
    );
    
    expect(getByText(expectedChildren)).toBeInTheDocument();
  });

  it('fallbacks to main page if authenticated', () => {
    const history = createMemoryHistory();
    const mockState = { isAuthenticated: true };
    useSelector.mockReturnValue(mockState);

    render(
        <Router location={history.location} navigator={history}>
            <Routes>
                <Route
                    path="/"
                    element={<UnauthorizedRoute/>}
                />
            </Routes>
        </Router>
    );
    expect(history.location.pathname).toEqual(ROUTES.MAIN)
  });
});