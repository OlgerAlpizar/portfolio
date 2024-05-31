import { AxiosInstance } from 'axios'
import { buildUserCookie } from '../utils/UserHelper'
import { parseCatchMessage } from '../utils/MessageHelper'
import { refreshSession } from '../../apis/AuthenticationService'
import { toast } from 'react-toastify'
import { useCallback, useEffect, useState } from 'react'
import AuthResponse from '../../apis/responses/AuthResponse'
import Cookies from 'js-cookie'
import User from '../../models/User'

export const useBasicAuth = (api: AxiosInstance) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState('')
  const authApiInstance = api

  const signIn = (res: AuthResponse) => {
    setAccessToken(res.accessToken)
    setCurrentUser(buildUserCookie(res))
    setIsAuthenticated(true)
  }

  const signOut = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setAccessToken('')
  }

  const isSigned = (): boolean => {
    return Cookies.get('signed') ? true : false
  }

  const refresh = useCallback(() => {
    refreshSession(authApiInstance)
      .then((res) => {
        signIn(res)
      })
      .catch((error) => toast.error(parseCatchMessage(error)))
  }, [authApiInstance])

  const autoCheckIn = useCallback(() => {
    const check = accessToken !== '' && isAuthenticated && currentUser !== null
    setIsAuthenticated(check)
    if (isSigned() && !check) {
      refresh()
    }
  }, [accessToken, currentUser, isAuthenticated, refresh])

  const updateAccessToken = async (newAccessToken: string) => {
    setAccessToken(newAccessToken)
  }

  useEffect(() => {
    autoCheckIn()
  }, [autoCheckIn])

  return {
    signIn,
    signOut,
    updateAccessToken,
    isSigned,
    refresh,
    isAuthenticated,
    currentUser,
    accessToken,
  }
}
