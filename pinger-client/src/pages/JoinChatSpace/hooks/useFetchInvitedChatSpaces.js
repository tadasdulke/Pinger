
import { useFetchData } from '@Common'

import getInvitedChatSpaces from '../serivces/getInvitedChatSpaces'

const useFetchInvitedChatSpaces = () => {
    const { loaded: invitedChatSpacesLoaded, result: invitedChatSpaces } = useFetchData(
        getInvitedChatSpaces,
     );


    return {
        invitedChatSpacesLoaded,
        invitedChatSpaces,
    }
}

export default useFetchInvitedChatSpaces;