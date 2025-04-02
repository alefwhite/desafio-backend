export interface ICreateUser {
  create: (input: ICreateUser.Input) => Promise<ICreateUser.Output>
}

export namespace ICreateUser {
  export type Input = {
    name: string
    email: string
    passwordHash: string
  }

  export type Output = { id: string }
}

export interface IGetUserByEmail {
  findByEmail: (input: IGetUserByEmail.Input) => Promise<IGetUserByEmail.Output>
}

export namespace IGetUserByEmail {
  export type Input = {
    email: string
  }

  export type Output = {
    id: string
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'CUSTOMER'
    createdAt: Date
    updatedAt: Date
  } | null
}
