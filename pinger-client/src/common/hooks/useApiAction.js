import { useState } from 'react';
import {useDispatch} from 'react-redux';

import { addError } from '@Store/slices/errors';

const useApiAction = (action, handleErrors = true) => {
  const [loaded, setLoaded] = useState(true);
  const dispatch = useDispatch();

  const sendAction = async (...args) => {
    try {
      setLoaded(false);
      const response = await action(...args);
      
      return response;
    } catch ({ response }) {
      const defaultError = "Something went wrong"

      if(response?.status) {
        const { status, data } = response;
        const { message } = data;

        handleErrors && dispatch(addError(message || defaultError));

        return { status, data };
      } else {
        handleErrors && dispatch(addError(defaultError));

        return { status: 500 };
      }
        
    } finally {
      setLoaded(true);
    }
  };

  return {
    loaded,
    sendAction,
  };
};

export default useApiAction;
