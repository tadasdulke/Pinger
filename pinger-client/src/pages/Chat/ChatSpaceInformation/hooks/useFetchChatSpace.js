import { useFetchData } from '@Common';

import getChatSpace from '../services/getChatSpace';

const useFetchChatSpace = (currentWorkspaceId) => {
    const { result } = useFetchData(
        () => getChatSpace(currentWorkspaceId)
    )

    return {
        result
    }
}

export default useFetchChatSpace;