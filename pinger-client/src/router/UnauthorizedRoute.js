import React from 'react';
import { useSelector } from 'react-redux';
import { ROUTES } from './constants';
import ProtectedRoute from './ProtectedRoute';

const UnauthorizedRoute = ({children}) => {
    const {isAuthenticated} = useSelector(store => store.auth);
    
    return (
        <ProtectedRoute isVerified={!isAuthenticated} fallbackRoute={ROUTES.MAIN}>
            {children}
        </ProtectedRoute>
    )
}

export default UnauthorizedRoute;