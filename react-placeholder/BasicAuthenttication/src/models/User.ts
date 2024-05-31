import { parseCamelCase } from '../shared/utils/TextHelper'

class User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  avatar: string

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    avatar: string,
    id?: string,
    password?: string
  ) {
    this.id = id ?? ''
    this.firstName = parseCamelCase(firstName.toLowerCase())
    this.lastName = parseCamelCase(lastName.toLowerCase())
    this.email = email
    this.password = password ?? ''
    this.avatar = avatar
  }
}

export default User
