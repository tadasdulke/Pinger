const jwtInterceptor = (instance, refreshToken) => {
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if(error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                await refreshToken();

                return instance(originalRequest)
            }
            
            return Promise.reject(error);
        }
    )
}

export default jwtInterceptor;