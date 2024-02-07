import axios from "axios";
import { ApiResponse, AuthModel, UserModel } from "./_models";
import {useAuth} from './Auth'

const API_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL, // our API base URL
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    // const {auth} = useAuth();
    const token = localStorage.getItem('kt-auth-react-v'); // Assuming you store the token in localStorage
    // console.log("aaaaaaa...", auth, token);
    if (token) {
      config.headers.Authorization = `JWT ${JSON.parse(token)}p`;
      // config.headers.Authorization = `Bearer ${auth?.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
    resp => resp,  // onFulfilled: return the response unchanged
    // onFulfilled: return the response unchanged
    async error => {
      const {auth, saveAuth} = useAuth()
      console.log("err......", error.response.status);
      if (error.response.status === 401) {
        const response = await refresh(auth?.refresh!);
        
        if (response.status === 200) {
          saveAuth(response.data)
          axios.defaults.headers.common['Authorization'] = `JWT ${response.data['access']}`;
          return axios(error.config);
        }
      }
      return Promise.reject(error); // Reject the promise with the original error
    }
  );



export const GET_USER_BY_ACCESSTOKEN_URL = `/verify_token`;
export const LOGIN_URL = `/api/accounts/login/`;
export const REFRESH_URL = `/api/accounts/refresh/`;
export const REGISTER_URL = `/api/accounts/register/`;
export const REQUEST_PASSWORD_URL = `/api/accounts/password/forgot/`;
export const VERIFY_EMAIL_URL = `/api/accounts/verify/email/`;
export const RESET_PASSWORD_URL = `/api/accounts/password/reset/`
export const EMP_CLINIC = `/api/clinic/as_employee/list/`

// Server should return AuthModel

export async function login(email: string, password: string) {
  const response = await api.post<ApiResponse>(LOGIN_URL, {
    email,
    password
});
    
    axios.defaults.headers.common['Authorization']=`Bearer ${(response.data as any).token.access}`;
    return response;
}

export async function refresh(refresh: string) {
  const response = await api.post<AuthModel>(REFRESH_URL, {refresh});
    
    axios.defaults.headers.common['Authorization']=`Bearer ${(response.data as any).access}`;
    return response;
}




// Server should return AuthModel
// export async function register(email: string,mobile: string,firstname: string,lastname: string,password: string,) {
//     const response = await axios.post(REGISTER_URL, {
//       email,
//       mobile,
//       first_name: firstname,
//       last_name: lastname,
//       password,
//     });
   
//      return response;
    
//   }

// Modify your _requests.js file

export async function register(email: string, mobile: string, firstname: string, lastname: string, password: string) {
  try {
    const response = await api.post(REGISTER_URL, {
      email,
      mobile,
      first_name: firstname,
      last_name: lastname,
      password,
    });
    
    return response.data; // Return the data from the server

  } catch (error) {
    
      throw error;
    }
  }
  






// Server should return object => { result: boolean } (Is Email in DB)
export async function requestPassword(email: string) {
  //console.log(email);
  const response= await api.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    username:email,
  });
  //console.log(response);
  return response;
  // return true;
}

export async function resetPassword(email: string,code:string,password:string) {
  // console.log(email);
  // console.log(code);
  // console.log(password);
  const response= await api.post<{ result: boolean }>(RESET_PASSWORD_URL, {
    username:email,
    password,
    code,
  });
  //console.log(response);
  return response;
  
  //console.log(response);
  // return response;
  // return true;
}

export function getUserByToken(token: string) {
  return api.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}

export async function verifyemailid(email: string,code:string){
  const response = await api.post(VERIFY_EMAIL_URL,{
    email,
    code,
  });
  console.log(response);
  return response;
  // console.log(response);
}

export async function empclinic() {
  return await api.get<any>(EMP_CLINIC);
}

// Export the api instance
export default api;
