import axios from "axios";
import { AuthModel, UserModel } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/api/accounts/login/`;
export const REGISTER_URL = `${API_URL}/api/accounts/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel

export async function login(email: string, password: string) {
  const response = await axios.post<AuthModel>(LOGIN_URL, {
    email,
    password
});
    axios.defaults.headers.common['Authorization']=`Bearer ${(response.data as any).token.access}`;
     //console.log((response.data as any).token.access);


    return response;
}




// Server should return AuthModel


export async function register(email: string,mobile: string,firstname: string,lastname: string,password: string,) {
  console.log("IN Request");
  
  
    await axios.post(REGISTER_URL, {
      email,
      mobile,
      first_name: firstname,
      last_name: lastname,
      password,
    });
    return ;
    // console.log("CHekking");
  }


// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}
