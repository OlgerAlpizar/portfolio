import { refreshSession } from '../../apis/AuthenticationService'
import { useContext, useEffect } from 'react'
import ErrorActionRequired from '../../apis/responses/ErrorActionRequired'
import SecurityContext from '../../contexts/SecurityContext'
import axios from 'axios'

export const useAxiosInstance = (baseUrl: string) => {
  const ctx = useContext(SecurityContext)

  const axiosPrivate = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  })

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (request) => {
        request.headers[
          'Authorization'
        ] = `Bearer ${ctx?.authenticator.accessToken}`
        return request
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (
          error.response.data.actionRequired ===
            ErrorActionRequired.RE_AUTHENTICATE &&
          ctx?.authenticator.isSigned()
        ) {
          const newAccessToken = await refreshSession(axiosPrivate)
          ctx?.updateAccessToken(newAccessToken.accessToken)

          const originalRequest = error.config
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${newAccessToken.accessToken}`

          return axiosPrivate(originalRequest)
        }

        if (error.response.data.statusCode === 401) {
          ctx?.authenticator.signOut()
        }

        return Promise.reject(error)
      }
    )
    return () => {
      // clean
      axiosPrivate.interceptors.request.eject(requestInterceptor)
      axiosPrivate.interceptors.response.eject(responseInterceptor)
    }
  }, [axiosPrivate, ctx])

  return axiosPrivate
}
