import { useApiAction } from '@Common';

import getToken from '../services/getToken';

const useLogin = () => useApiAction(
  (username, password) => getToken(username, password),
);

export default useLogin;
