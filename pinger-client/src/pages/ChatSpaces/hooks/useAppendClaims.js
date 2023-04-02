import { useApiAction } from '@Common';

import appendClaims from '../services/appendClaims';

const useAppendClaims = (errorHandler) => {
  const { loaded, sendAction } = useApiAction(
    (chatspaceId) => appendClaims(chatspaceId),
    errorHandler,
  );

  return {
    claimsAdded: loaded,
    addClaims: sendAction,
  };
};

export default useAppendClaims;
