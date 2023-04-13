import { useFetchData } from '@Common';
import getUserChatSpaces from '../services/getUserChatSpaces';

const useFetchUserChatSpaces = () => {
    const { loaded, result: chatSpaces } = useFetchData(
        getUserChatSpaces,
    );

    return {
        loaded,
        chatSpaces
    }
}

export default useFetchUserChatSpaces;