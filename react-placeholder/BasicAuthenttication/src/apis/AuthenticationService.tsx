import { AxiosInstance } from 'axios'
import AuthResponse from './responses/AuthResponse'
import CreateAccount from './requests/CreateAccountRequest'
import SignInRequest from './requests/SignInRequest'
import SocialLink from '../models/SocialNetwork'

export const signIn = async (
  api: AxiosInstance,
  request: SignInRequest
): Promise<AuthResponse> => {
  return api
    .post('/sign-in', request, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    .then((res) => res.data)
}

export const signUp = async (
  api: AxiosInstance,
  request: CreateAccount
): Promise<AuthResponse> => {
  return api.post('/sign-up', request).then((res) => res.data)
}

export const signOut = async (
  api: AxiosInstance,
  request: string
): Promise<AuthResponse> => {
  return api.post('/sign-out', { email: request }).then((res) => res.data)
}

export const resetPassword = async (
  api: AxiosInstance,
  request: string
): Promise<unknown> => {
  return api
    .post('/forgot-password', { email: request })
    .then((res) => res.data)
}

export const refreshSession = async (
  api: AxiosInstance
): Promise<AuthResponse> => {
  return api.get('refresh-session').then((res) => res.data)
}

export const authVerification = async (
  api: AxiosInstance
): Promise<boolean> => {
  return api.post('/check-auth').then((res) => res.data)
}

export const signInPassport = async (
  api: AxiosInstance,
  link: SocialLink
): Promise<unknown> => {
  throw `Social login not implemented yet ${link}. ${api.toString()}`
}

export const signUpPassport = async (
  api: AxiosInstance,
  link: SocialLink
): Promise<unknown> => {
  throw `Social register not implemented yet ${link}. ${api.toString()}`
}
