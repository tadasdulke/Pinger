import { useApiAction } from '@Common';

import updatePrivateMessage from '../services/updatePrivateMessage';

const useUpdatePrivateMessage = () => {
  const { loaded, sendAction } = useApiAction(
    (id, body) => updatePrivateMessage(id, body),
  );

  return {
    privateMessageUpdated: loaded,
    sendUpdateMessageAction: sendAction,
  };
};

export default useUpdatePrivateMessage;
