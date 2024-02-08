import axios from "axios";
import { ApiResponse, AuthModel, UserModel } from "./_models";
import {useAuth} from './Auth'
import { AUTH_LOCAL_STORAGE_KEY, AUTH_REFRESH_STORAGE_KEY } from './AuthHelpers'

// import useAxiosPrivate from "./useAxiosPrivate";

const API_URL = import.meta.env.VITE_APP_API_URL;

const api = axios.create({
  baseURL: API_URL, // our API base URL
});

// const axiosPrivate = useAxiosPrivate();

export const GET_USER_BY_ACCESSTOKEN_URL = `/verify_token`;
export const LOGIN_URL = `/api/accounts/login/`;
export const REFRESH_URL = `/api/accounts/refresh/`;
export const REGISTER_URL = `/api/accounts/register/`;
export const REQUEST_PASSWORD_URL = `/api/accounts/password/forgot/`;
export const VERIFY_EMAIL_URL = `/api/accounts/verify/email/`;
export const RESET_PASSWORD_URL = `/api/accounts/password/reset/`
export const EMP_CLINIC = `/api/clinic/as_employee/list/`

// Server should return AuthModel


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
  try {
    return await api.get<any>(EMP_CLINIC);
  } catch(e) {
    throw e;
  }
  
}

// Export the api instance
export default api;
