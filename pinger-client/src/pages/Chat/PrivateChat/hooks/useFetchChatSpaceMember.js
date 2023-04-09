import { useFetchData } from '@Common';
import getChatSpaceMember from '../services/getChatSpaceMember';

const useFetchChatSpaceMember = (memberId, deps = []) => {
  const { loaded, result } = useFetchData(
    () => getChatSpaceMember(memberId),
    deps,
  );

  return {
    memberFetched: loaded,
    member: result?.data,
  };
};

export default useFetchChatSpaceMember;
