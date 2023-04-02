import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isVerified, fallbackRoute, children }) {
  return isVerified ? children : <Navigate to={fallbackRoute} />;
}

export default ProtectedRoute;
