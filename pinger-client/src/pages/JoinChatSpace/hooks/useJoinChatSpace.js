import { useApiAction } from '@Common';
import joinChatSpace from '../serivces/joinChatSpace';

const useJoinChatSpace = () => {
  const { loaded, sendAction } = useApiAction(
    (chatspaceId) => joinChatSpace(chatspaceId),
  );

  return {
    chatSpaceJoined: loaded,
    joinChatSpace: sendAction,
  };
};

export default useJoinChatSpace;
