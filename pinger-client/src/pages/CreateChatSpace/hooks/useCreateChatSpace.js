import { useApiAction } from '@Common'
import createChatSpace from '../services/createChatSpace';

const useCreateChatSpace = () => {
  const { sendAction } = useApiAction((name, isPrivate) => createChatSpace(name, isPrivate));

  return {
    sendAction
  }
}

export default useCreateChatSpace;