import { axiosPrivate } from "./axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
// import { useAuth } from "./Auth";
import { AUTH_LOCAL_STORAGE_KEY, AUTH_REFRESH_STORAGE_KEY } from './AuthHelpers'

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    // const { auth } = useAuth();
    const accessToken = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `JWT ${JSON.parse(accessToken!)}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const refreshToken = localStorage.getItem(AUTH_REFRESH_STORAGE_KEY);
                const prevRequest = error?.config;
                console.log("error?.config", error?.config);
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh(JSON.parse(refreshToken!));
                    prevRequest.headers['Authorization'] = `JWT ${JSON.parse(newAccessToken!)}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;