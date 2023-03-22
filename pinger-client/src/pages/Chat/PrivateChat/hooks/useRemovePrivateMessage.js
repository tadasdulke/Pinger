import { useApiAction } from '@Common';

import removePrivateMessage from '../services/removePrivateMessage'

const useRemovePrivateMessage = (errorHandler) => {
    const {loaded, sendAction} = useApiAction(
        (id) => removePrivateMessage(id),
        errorHandler
    )

    return {
        privateMessageRemoved: loaded,
        sendRemoveMessageAction: sendAction,
    }
}

export default useRemovePrivateMessage;