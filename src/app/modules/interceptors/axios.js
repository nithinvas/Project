import axios from "axios";
import { url } from "inspector";
import { config } from "process";
import useAuth from '../core/Auth'

axios.defaults.baseURL='https://stageio.symplify.app';
/*
axios.interceptors.response.use(
  config => {
    const {auth} = useAuth();
    console.log("auth...", auth);

    config.headers['Authorization'] = `Bearer ${auth.access}`;
    config.headers['Content-Type'] = 'application/json';
        return config;
    },
    resp => resp,  // onFulfilled: return the response unchanged
    // onFulfilled: return the response unchanged
    async error => {
      const {auth, saveAuth, setCurrentUser} = useAuth()
      console.log("err......", error);
      if (error.response.status === 401) {
        const response = await refresh(auth.refresh);
        
        if (response.status === 200) {
          saveAuth(response.data)
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
          return axios(error.config);
        }
      }
      return Promise.reject(error); // Reject the promise with the original error
    }
  );
  */