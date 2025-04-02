import { BaseError } from '@/contracts/error/base-error'

export class ErrorEmailNotFound extends BaseError {
  constructor() {
    super('Email not exists!', 404)
    this.name = 'ErrorEmailNotFound'
  }
}
