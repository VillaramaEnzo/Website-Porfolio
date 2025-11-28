// Authentication types - ready for database integration
export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export interface LoginCredentials {
  phoneNumber: string
  password: string
}

// Future: Add user interface when database is connected
// export interface User {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
//   phoneNumber: string
//   createdAt: Date
// }

