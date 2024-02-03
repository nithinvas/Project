import axios from "axios";
import { url } from "inspector";
import { config } from "process";

axios.defaults.baseURL='https://stageio.symplify.app';

axios.interceptors.response.use(
    resp => resp,  // onFulfilled: return the response unchanged
    async error => {
      console.log("err", error);
      if (error.response.status === 401) {
        const response = await axios.post('/refresh', {}, { withCredentials: true });
        if (response.status === 200) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
          return axios(error.config);
        }
      }
      return Promise.reject(error); // Reject the promise with the original error
    }
  );
  