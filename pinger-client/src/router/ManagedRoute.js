import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './constants';

function ManagedRoute() {
  const { currentWorkspaceId } = useSelector((state) => state.workspace);

  if (currentWorkspaceId) {
    return (
      <Navigate to={ROUTES.USE_CHATSPACE} replace />
    );
  }

  return <Navigate to={ROUTES.CHATSPACES} replace />;
}

export default ManagedRoute;
