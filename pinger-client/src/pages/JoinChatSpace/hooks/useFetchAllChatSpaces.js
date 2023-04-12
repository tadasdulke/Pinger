
import { useFetchData } from '@Common'

import getChatSpaces from '../serivces/getChatSpaces';

const useFetchAllChatSpaces = () => {
    const { result: allChatSpaces } = useFetchData(
        getChatSpaces,
     );


    return {
        allChatSpaces,
    }
}

export default useFetchAllChatSpaces;