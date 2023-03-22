import { useApiAction } from '@Common';

import updatePrivateMessage from '../services/updatePrivateMessage';

const useUpdatePrivateMessage = (errorHandler) => {
    const {loaded, sendAction} = useApiAction(
        (id, body) => updatePrivateMessage(id, body),
        errorHandler
    )

    return {
        privateMessageUpdated: loaded,
        sendUpdateMessageAction: sendAction,
    }
}

export default useUpdatePrivateMessage;