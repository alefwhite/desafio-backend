import type { Optional } from '@/utils/optional-type'

type User = {
  id?: string
  name: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  createdAt?: Date
  updatedAt?: Date
}

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

  export type Output = Optional<
    User & { password: string },
    'createdAt' | 'updatedAt'
  > | null
}
