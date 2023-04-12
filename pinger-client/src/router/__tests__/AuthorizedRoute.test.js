import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import AuthorizedRoute from '../AuthorizedRoute';
import { ROUTES } from '@Router'
import { createMemoryHistory } from 'history';
import { MemoryRouter, Routes, Route, Router } from 'react-router-dom'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('AuthorizedRoute', () => {
  it('renders children when authenticated', () => {
    const mockState = { isAuthenticated: true };
    useSelector.mockReturnValue(mockState);

    const expectedChildren = "only authenticated users can see me";

    const { getByText } = render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route
                    path="/"
                    element={<AuthorizedRoute>{expectedChildren}</AuthorizedRoute>}
                />
            </Routes>
        </MemoryRouter>
    );
    
    expect(getByText(expectedChildren)).toBeInTheDocument();
  });

  it('fallbacks to login page if unauthenticated', () => {
    const history = createMemoryHistory();
    const mockState = { isAuthenticated: false };
    useSelector.mockReturnValue(mockState);

    const expectedChildren = "login page content";

    render(
        <Router location={history.location} navigator={history}>
            <Routes>
                <Route
                    path="/"
                    element={<AuthorizedRoute>{expectedChildren}</AuthorizedRoute>}
                />
            </Routes>
        </Router>
    );
    expect(history.location.pathname).toEqual(ROUTES.LOGIN)
  });
});