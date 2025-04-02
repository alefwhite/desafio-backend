import { Bcrypt } from '@/libs/bcrypt'
import { makeUsersRepository } from '@/repositories/factories/makeUsersRepository'
import { AuthenticatesUseCase } from '@/usecases/users/authenticate'

export const makeAuthenticateUseCase = (): AuthenticatesUseCase => {
  return new AuthenticatesUseCase(makeUsersRepository(), new Bcrypt())
}
