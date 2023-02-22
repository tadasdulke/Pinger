import { useApiAction } from '@Common';

import handleRegistration from '../services/handleRegistration';

const useRegistration = (errorHandler) => useApiAction(
  (email, username, password) => handleRegistration(email, username, password),
  errorHandler,
);

export default useRegistration;