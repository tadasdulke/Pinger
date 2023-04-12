import { useApiAction } from '@Common'
import createChatSpace from '../services/createChatSpace';

const useCreateChatSpace = () => {
  const { sendAction } = useApiAction((name) => createChatSpace(name));

  return {
    sendAction
  }
}

export default useCreateChatSpace;