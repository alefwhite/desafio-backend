import { Bcrypt } from '@/libs/bcrypt'
import { makeUsersRepository } from '@/repositories/factories/make-users-repository'
import { CreateUsersUseCase } from '@/usecases/users/create'

export const makeCreateUsersUseCase = (): CreateUsersUseCase => {
  return new CreateUsersUseCase(makeUsersRepository(), new Bcrypt())
}
