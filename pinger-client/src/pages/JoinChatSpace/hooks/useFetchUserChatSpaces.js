import { useFetchData } from '@Common'

import getUserChatSpaces from '../../ChatSpaces/services/getUserChatSpaces';

const useFetchUserChatSpaces = () => {
    const { loaded: joinedChatSpacesLoaded, result: joinedChatSpaces } = useFetchData(
        getUserChatSpaces,
    );

    return {
        joinedChatSpacesLoaded,
        joinedChatSpaces
    }
}

export default useFetchUserChatSpaces;