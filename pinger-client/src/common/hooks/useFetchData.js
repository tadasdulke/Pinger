import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { addError } from '@Store/slices/errors';


const useFetchData = (
  fetchAction,
  deps = [],
) => {
  const [result, setResult] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const dispatch = useDispatch();

  const core = async () => {
    try {
      setLoaded(false);
      const response = await fetchAction();
      setResult(response);
    } catch ({ response }) {
      if(response?.status) {
        const { status, data } = response;
        const { message } = data;

        if(message) {
          dispatch(addError(message));
        } else {
          dispatch(addError("Something went wrong"));
        }

        return { status, data };
      } else {
        return { status: 500 };
      }
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    (async () => {
      await core();
    })();
  }, deps);

  const setData = (data) => {
    setResult({
      ...result,
      data,
    });
  };

  return {
    result,
    loaded,
    reload: core,
    setData,
  };
};

export default useFetchData;
