import { useApiAction } from '@Common';

import handleRegistration from '../services/handleRegistration';

const useRegistration = () => useApiAction(
  (email, username, password) => handleRegistration(email, username, password),
);

export default useRegistration;
