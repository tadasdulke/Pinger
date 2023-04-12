import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { ROUTES } from '@Router'
import { createMemoryHistory } from 'history';
import { Routes, Route, Router } from 'react-router-dom'
import ManagedRoute from '../ManagedRoute';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('ManagedRoute', () => {
  it('renders chat space if chatspace id is present in store', () => {
    const history = createMemoryHistory();
    const mockState = { currentWorkspaceId: 1 };
    useSelector.mockReturnValue(mockState);

    render(
        <Router location={history.location} navigator={history}>
            <Routes>
                <Route
                    path="/"
                    element={<ManagedRoute/>}
                />
            </Routes>
        </Router>
    );

    expect(history.location.pathname).toEqual(ROUTES.USE_CHATSPACE)
  });

  it('renders choose chatspace page if chatspace id is not present in store', () => {
    const history = createMemoryHistory();
    const mockState = { currentWorkspaceId: null };
    useSelector.mockReturnValue(mockState);

    render(
        <Router location={history.location} navigator={history}>
            <Routes>
                <Route
                    path="/"
                    element={<ManagedRoute/>}
                />
            </Routes>
        </Router>
    );

    expect(history.location.pathname).toEqual(ROUTES.CHATSPACES)
  });
});