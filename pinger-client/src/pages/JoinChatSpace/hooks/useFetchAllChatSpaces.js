
import { useFetchData } from '@Common'

import getChatSpaces from '../serivces/getChatSpaces';

const useFetchAllChatSpaces = () => {
    const { loaded: allChatSpacesLoaded, result: allChatSpaces } = useFetchData(
        getChatSpaces,
     );


    return {
        allChatSpacesLoaded,
        allChatSpaces,
    }
}

export default useFetchAllChatSpaces;