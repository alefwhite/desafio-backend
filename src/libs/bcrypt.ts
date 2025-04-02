import type { IEncrypter } from '@/contracts/libs/encrypter'
import bcrypt from 'bcryptjs'

export class Bcrypt implements IEncrypter {
  private readonly saltRounds: number

  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
