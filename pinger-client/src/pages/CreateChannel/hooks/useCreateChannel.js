import { useApiAction } from '@Common';
import createChannel from '../services/createChannel';

const useCreateChannel = (errorHandler) => {
  const { loaded, sendAction } = useApiAction(
    (name) => createChannel(name),
    errorHandler,
  );

  return {
    channelCreated: loaded,
    createChannel: sendAction,
  };
};

export default useCreateChannel;
