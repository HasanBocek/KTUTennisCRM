export type User = {
  id?: string
  email?: string
  username?: string
  password?: string
  firstName?: string
  lastName?: string
  role?: string
  token?: string
}

export type Role = {
  id?: string
  name?: string
  permissions?: string[]
}
