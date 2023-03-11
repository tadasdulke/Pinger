import { useApiAction } from '@Common';

import addContactedUser from '../services/addContactedUser';

const useAddContactedUser = (errorHandler) => {
    const { loaded, sendAction } = useApiAction(
        async (contactedUserId) => await addContactedUser(contactedUserId),
        errorHandler
    )

    return {
        userAdded: loaded,
        addContactedUser: sendAction, 
    }
};

export default useAddContactedUser;