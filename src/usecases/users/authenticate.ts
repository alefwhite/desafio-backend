import type { IEncrypter } from '@/contracts/libs/encrypter'
import type { IGetUserByEmail } from '@/contracts/repositories/users'
import { ErrorEmailNotFound } from '@/usecases/errors/email-not-found'
import { ErrorInvalidCredentials } from '@/usecases/errors/invalid-credentials'

type AuthenticateDTO = {
  email: string
  password: string
}

type Output = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

export class AuthenticatesUseCase {
  constructor(
    private readonly usersRepository: IGetUserByEmail,
    private readonly encrypter: IEncrypter
  ) {}

  async execute({ email, password }: AuthenticateDTO): Promise<Output> {
    const user = await this.usersRepository.findByEmail({
      email,
    })

    if (!user) {
      throw new ErrorEmailNotFound()
    }

    const isPasswordValid = await this.encrypter.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      throw new ErrorInvalidCredentials()
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
