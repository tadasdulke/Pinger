import React from 'react';
import { useSelector } from 'react-redux';
import { ROUTES } from './constants';
import ProtectedRoute from './ProtectedRoute';

function AuthorizedRoute({ children }) {
  const { isAuthenticated } = useSelector((store) => store.auth);

  return (
    <ProtectedRoute isVerified={isAuthenticated} fallbackRoute={ROUTES.LOGIN}>
      {children}
    </ProtectedRoute>
  );
}

export default AuthorizedRoute;
