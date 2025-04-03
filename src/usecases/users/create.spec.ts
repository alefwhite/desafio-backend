import * as crypto from 'node:crypto'
import type { IEncrypter } from '@/contracts/libs/encrypter'
import type {
  ICreateUser,
  IGetUserByEmail,
} from '@/contracts/repositories/users'
import { ErrorEmailAlreadyExists } from '@/usecases/errors'
import { CreateUsersUseCase } from '@/usecases/users/create'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let sut: CreateUsersUseCase
let usersRepository: ICreateUser & IGetUserByEmail
let encrypter: IEncrypter

describe('Create User UseCase', () => {
  const newUser = {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'password123',
  }

  beforeEach(() => {
    encrypter = {
      hash: vi.fn().mockResolvedValue('hashedPassword'),
    } as unknown as IEncrypter

    usersRepository = {
      create: vi.fn().mockResolvedValue({ id: crypto.randomUUID() }),
      findByEmail: vi
        .fn()
        .mockImplementation(({ email }: { email: string }) => {
          if (email === 'john.doe@example.com') {
            return {
              name: 'John Doe',
              email: 'john.doe@example.com',
              password: 'hashedPassword',
              role: 'CUSTOMER',
            }
          }
          return null
        }),
    } as unknown as ICreateUser & IGetUserByEmail

    sut = new CreateUsersUseCase(usersRepository, encrypter)
  })

  it('Should hash the password and create a user', async () => {
    await sut.execute(newUser)

    expect(encrypter.hash).toHaveBeenCalledWith('password123')
    expect(usersRepository.create).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@gmail.com',
      passwordHash: 'hashedPassword',
    })
  })

  it('Should throw if email already exists', async () => {
    vi.spyOn(usersRepository, 'create').mockImplementationOnce(() => {
      throw new ErrorEmailAlreadyExists()
    })

    const promise = sut.execute({
      ...newUser,
      email: 'john.doe@example.com',
    })

    await expect(promise).rejects.toBeInstanceOf(ErrorEmailAlreadyExists)
  })
})
