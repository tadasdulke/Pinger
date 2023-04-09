import { useApiAction } from '@Common';

import removePrivateMessage from '../services/removePrivateMessage';

const useRemovePrivateMessage = () => {
  const { loaded, sendAction } = useApiAction(
    (id) => removePrivateMessage(id),
  );

  return {
    privateMessageRemoved: loaded,
    sendRemoveMessageAction: sendAction,
  };
};

export default useRemovePrivateMessage;
