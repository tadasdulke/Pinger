import React from 'react';
import { useSelector } from 'react-redux';
import { ROUTES } from './constants';
import ProtectedRoute from './ProtectedRoute';

const UnauthorizedRoute = ({children}) => {
    const token = useSelector(store => store.auth.token);
    
    return (
        <ProtectedRoute isVerified={!token} fallbackRoute={ROUTES.MAIN}>
            {children}
        </ProtectedRoute>
    )
}

export default UnauthorizedRoute;