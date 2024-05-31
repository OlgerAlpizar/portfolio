import { FC, createContext } from 'react'
import { authenticationApi } from '../configurations/settings'
import { toast } from 'react-toastify'
import { useAxiosInstance } from '../shared/hooks/AxiosHook'
import { useBasicAuth } from '../shared/hooks/AuthHook'
import AuthResponse from '../apis/responses/AuthResponse'

type SecurityContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticator: any // as this is a hook, using any is easier than deconstruct the entire object
  onBasicSignIn: (res: AuthResponse, alert: string) => void
  onBasicSignOut: () => void
  updateAccessToken: (newAccessToken: string) => void
}

const SecurityContext = createContext<SecurityContextProps | null>(null)

type SecurityContextProviderProps = {
  children: React.ReactNode
}

export const SecurityContextProvider: FC<SecurityContextProviderProps> = (
  props: SecurityContextProviderProps
) => {
  const authenticator = useBasicAuth(useAxiosInstance(authenticationApi()))

  const onBasicSignIn = (res: AuthResponse, alert: string) => {
    authenticator.signIn(res)
    toast.success(alert)
  }

  const onBasicSignOut = () => {
    authenticator.signOut()
  }

  const updateAccessToken = async (newAccessToken: string) => {
    await authenticator.updateAccessToken(newAccessToken)
  }

  return (
    <SecurityContext.Provider
      value={{
        authenticator: authenticator,
        onBasicSignIn: onBasicSignIn,
        onBasicSignOut: onBasicSignOut,
        updateAccessToken: updateAccessToken,
      }}
    >
      {props.children}
    </SecurityContext.Provider>
  )
}

export default SecurityContext
