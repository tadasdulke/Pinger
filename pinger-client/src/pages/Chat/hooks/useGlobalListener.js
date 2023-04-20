import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router';

import { addNotification } from "../../../store/slices/notifications";

const useGlobalListener = (connection) => {
    const { currentWorkspaceId } = useSelector(state => state.workspace);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if(connection) {
            const callBack = async (data) => {
                console.log(data);
                const isActiveWorkspace = data.id === currentWorkspaceId;
    
                if(isActiveWorkspace) {
                    dispatch(addNotification({
                        notification: `You were removed from ${data.name} chatspace`,
                        type: "danger"
                    }))
                    navigate(ROUTES.CHATSPACES)
                }
            };
        
            connection.on('RemovedFromChatSpace', callBack);
        
            return () => connection.off('RemovedFromChatSpace', callBack);
        }
    }, [currentWorkspaceId, connection]);
}

export default useGlobalListener;