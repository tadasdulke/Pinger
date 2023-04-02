import store from '@Store';
import LOCAL_STORAGE_ITEMS from '../../common/config/localStorageItems';
import { logout } from '../../store/slices/auth';

const jwtInterceptor = (instance, refreshToken) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshToken();
        } catch (err) {
          store.dispatch(logout());
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.IS_AUTHENTICATED);
        }

        return instance(originalRequest);
      }

      return Promise.reject(error);
    },
  );
};

export default jwtInterceptor;
