import type { IEncrypter } from '@/contracts/libs/encrypter'
import type {
  ICreateUser,
  IGetUserByEmail,
} from '@/contracts/repositories/users'
import { ErrorEmailAlreadyExists } from '@/usecases/errors'

type UserDTO = {
  name: string
  email: string
  password: string
}

export class CreateUsersUseCase {
  constructor(
    private readonly usersRepository: ICreateUser & IGetUserByEmail,
    private readonly encrypter: IEncrypter
  ) {}

  async execute(input: UserDTO): Promise<ICreateUser.Output> {
    const userEmailAlreadyExists = await this.usersRepository.findByEmail({
      email: input.email,
    })

    if (userEmailAlreadyExists) {
      throw new ErrorEmailAlreadyExists()
    }

    const passwordHash = await this.encrypter.hash(input.password)

    return this.usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    })
  }
}
