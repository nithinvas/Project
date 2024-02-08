/* eslint-disable @typescript-eslint/no-explicit-any */
import {AuthModel} from './_models'

const AUTH_LOCAL_STORAGE_KEY = 'access_token'
const AUTH_REFRESH_STORAGE_KEY='refresh_token'
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }
  
  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  // console.log("lsValue", lsValue, typeof lsValue);
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    // console.log("authH...", auth, typeof auth)
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth.access)
    const refsValue = JSON.stringify(auth.refresh)
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
    localStorage.setItem(AUTH_REFRESH_STORAGE_KEY, refsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    localStorage.removeItem(AUTH_REFRESH_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      if (auth && auth.access) {
        config.headers.Authorization = `Bearer ${auth.access}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY, AUTH_REFRESH_STORAGE_KEY}
