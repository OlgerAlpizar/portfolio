interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  firstName: string
  lastName: string
  avatar: string
  email: string
}

export default AuthResponse
