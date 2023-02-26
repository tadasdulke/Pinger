import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './constants';

const ManagedRoute = () => {
    const { currentWorkspaceId } = useSelector(state => state.workspace)
 
    if(currentWorkspaceId) {
        return <Navigate to={ROUTES.MAIN} replace={true}/>;
    }

    return <Navigate to={ROUTES.CHATSPACES} replace={true}/>

}

export default ManagedRoute;