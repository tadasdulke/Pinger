import { useApiAction } from '@Common';
import joinChatSpace from '../serivces/joinChatSpace';

const useJoinChatSpace = (errorHandler) => {
  const { loaded, sendAction } = useApiAction(
    (chatspaceId) => joinChatSpace(chatspaceId),
    errorHandler,
  );

  return {
    chatSpaceJoined: loaded,
    joinChatSpace: sendAction,
  };
};

export default useJoinChatSpace;
