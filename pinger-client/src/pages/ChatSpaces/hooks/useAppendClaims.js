import { useApiAction } from '@Common';

import appendClaims from '../services/appendClaims';

const useAppendClaims = () => {
  const { loaded, sendAction } = useApiAction(
    (chatspaceId) => appendClaims(chatspaceId),
  );

  return {
    claimsAdded: loaded,
    addClaims: sendAction,
  };
};

export default useAppendClaims;
