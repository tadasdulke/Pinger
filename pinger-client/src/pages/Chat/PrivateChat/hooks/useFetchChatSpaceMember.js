import { useFetchData } from '@Common'
import getChatSpaceMember from '../services/getChatSpaceMember'

const useFetchChatSpaceMember = (errorHandler, memberId, resolveErrorMessage = null, deps = []) => {
    const { loaded, result } = useFetchData(
        () => getChatSpaceMember(memberId),
        errorHandler,
        resolveErrorMessage,
        deps
    )

    return {
        memberFetched: loaded,
        member: result?.data,
    }
}

export default useFetchChatSpaceMember;