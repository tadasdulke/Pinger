import React from 'react';

import { useErrorWrapperAlertState } from '../hooks';

const withErrorWrapper = (Component) => function (props) {
  const {
    isErrorShown,
    errorMessage,
    showError,
    hideError,
  } = useErrorWrapperAlertState();

  const errorHandler = {
    showError,
    hideError,
  };

  return (
    <>
      {isErrorShown && errorMessage && (
        <div>{errorMessage}</div>
      )}
      <Component {...props} errorHandler={errorHandler} />
    </>
  );
};

export default withErrorWrapper;
