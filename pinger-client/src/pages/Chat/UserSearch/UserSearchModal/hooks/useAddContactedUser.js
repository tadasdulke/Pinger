import { useApiAction } from '@Common';

import addContactedUser from '../services/addContactedUser';

const useAddContactedUser = () => {
  const { loaded, sendAction } = useApiAction(
    async (contactedUserId) => await addContactedUser(contactedUserId),
  );

  return {
    userAdded: loaded,
    addContactedUser: sendAction,
  };
};

export default useAddContactedUser;
