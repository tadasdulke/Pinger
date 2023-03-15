import { useFetchData } from '@Common'
import getChatSpaceMember from '../services/getChatSpaceMember'

const useFetchChatSpaceMember = (errorHandler, memberId) => {
    const { loaded, result } = useFetchData(
        () => getChatSpaceMember(memberId),
        errorHandler
    )

    return {
        memberFetched: loaded,
        member: result?.data,
    }
}

export default useFetchChatSpaceMember;