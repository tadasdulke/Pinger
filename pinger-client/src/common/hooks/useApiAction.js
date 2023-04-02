import { useState } from 'react';

import { DEFAULT_ERROR } from '../config/errorMessages';

const defaultErrorHandler = {
  showError: () => null,
  hideError: () => null,
};

const useApiAction = (action, errorHandler = defaultErrorHandler, resolveErrorMessage = null) => {
  const [loaded, setLoaded] = useState(true);

  const sendAction = async (...args) => {
    try {
      setLoaded(false);
      const response = await action(...args);
      errorHandler.hideError();

      return response;
    } catch ({ response: { status, data } }) {
      const errorMessage = resolveErrorMessage === null
        ? DEFAULT_ERROR
        : resolveErrorMessage(status);

      errorHandler.showError(errorMessage);

      return { status, data };
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
