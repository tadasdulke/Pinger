import { useFetchData } from '@Common';
import getContactedUser from '../services/getContactedUser';

const useFetchContactedUser = (contactedUserId) => {
  const { loaded, result } = useFetchData(
    () => getContactedUser(contactedUserId),
  );

  return {
    contactedUserInfoLoaded: loaded,
    contactedUserInfo: result?.data
  };
};

export default useFetchContactedUser;
