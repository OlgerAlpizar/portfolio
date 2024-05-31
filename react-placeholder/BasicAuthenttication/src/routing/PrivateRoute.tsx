import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import React, { FC, useContext } from 'react'
import SecurityContext from '../contexts/SecurityContext'

type PrivateRouteProps = {
  children?: React.ReactNode
}

const PrivateRoute: FC<PrivateRouteProps> = (props: PrivateRouteProps) => {
  const ctx = useContext(SecurityContext)

  const redirect = () => {
    toast.error('Un-authorized user. Please sign in first')
    return <Navigate to="/home" />
  }

  return <>{ctx?.authenticator.isAuthenticated ? props.children : redirect()}</>
}

export default PrivateRoute
