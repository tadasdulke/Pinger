import { useFetchData } from '@Common';
import getContactedUser from '../services/getContactedUser';

const useFetchContactedUser = (contactedUserId, deps) => {
  const { loaded, result } = useFetchData(
    () => getContactedUser(contactedUserId),
    deps
  );

  return {
    contactedUserInfoLoaded: loaded,
    contactedUserInfo: result?.data
  };
};

export default useFetchContactedUser;
