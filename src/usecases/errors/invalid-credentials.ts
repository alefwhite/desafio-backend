import { BaseError } from '@/contracts/error/base-error'

export class ErrorInvalidCredentials extends BaseError {
  constructor() {
    super('Credentials is invalid!', 400)
    this.name = 'ErrorInvalidCredentials '
  }
}
