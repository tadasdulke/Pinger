import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isVerified, fallbackRoute , children }) => isVerified ? children : <Navigate to={fallbackRoute}/>

export default ProtectedRoute;