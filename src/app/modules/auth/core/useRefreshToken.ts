import axios from './axios';
import {useAuth} from './Auth';
import * as authHelper from './AuthHelpers'
import { AuthModel } from "./_models";

const useRefreshToken = () => {
    const { saveAuth, logout } = useAuth();

    const refresh = async (token:any) => {
        try {
            const response = await axios.post<AuthModel>('/accounts/refresh/', {refresh: token});

            authHelper.setAuth(response.data);
            saveAuth(response.data)
            return response.data.access;
        } catch(e:any) {
            console.log("any", e);
            logout();
        }
        
    }
    return refresh;
};

export default useRefreshToken;
