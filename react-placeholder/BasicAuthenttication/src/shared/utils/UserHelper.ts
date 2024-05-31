import AuthResponse from '../../apis/responses/AuthResponse'
import User from '../../models/User'
import defaultAvatar from '../../assets/default_avatar.png'

export const getUserAvatar = (image?: string) => {
  return image ? image : defaultAvatar
}

export const buildUserCookie = (res: AuthResponse) => {
  return new User(res.firstName, res.lastName, res.email, res.avatar)
}
