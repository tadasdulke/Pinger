import { useState, useEffect } from 'react';
import { DEFAULT_ERROR } from '../config/errorMessages';

const useFetchData = (
  fetchAction,
  errorHandler,
  resolveErrorMessage = null,
  deps = [],
) => {
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(true);

  const core = async () => {
    try {
      setLoaded(false);
      const response = await fetchAction();
      errorHandler.hideError();
      setResult(response);
    } catch ({ response: { status } }) {
      const errorMessage = resolveErrorMessage === null
        ? DEFAULT_ERROR
        : resolveErrorMessage(status);

      errorHandler.showError(errorMessage);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    (async () => {
      await core();
    })();
  }, deps);

  return {
    result,
    loaded,
    reload: core,
  };
};

export default useFetchData;