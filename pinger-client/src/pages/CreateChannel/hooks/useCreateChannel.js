import { useApiAction } from '@Common';
import createChannel from '../services/createChannel';

const useCreateChannel = () => {
  const { loaded, sendAction } = useApiAction(
    (name) => createChannel(name),
  );

  return {
    channelCreated: loaded,
    createChannel: sendAction,
  };
};

export default useCreateChannel;
