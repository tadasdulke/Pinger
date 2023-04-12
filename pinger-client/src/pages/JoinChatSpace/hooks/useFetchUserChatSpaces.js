import { useFetchData } from '@Common'

import getUserChatSpaces from '../../ChatSpaces/services/getUserChatSpaces';

const useFetchUserChatSpaces = () => {
    const { result: joinedChatSpaces } = useFetchData(
        getUserChatSpaces,
    );

    return {
        joinedChatSpaces
    }
}

export default useFetchUserChatSpaces;