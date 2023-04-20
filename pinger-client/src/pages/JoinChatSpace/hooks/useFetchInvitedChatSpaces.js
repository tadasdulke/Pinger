
import { useFetchData } from '@Common'

import getInvitedChatSpaces from '../serivces/getInvitedChatSpaces'

const useFetchInvitedChatSpaces = () => {
    const { result: invitedChatSpaces } = useFetchData(
        getInvitedChatSpaces,
     );


    return {
        invitedChatSpaces,
    }
}

export default useFetchInvitedChatSpaces;