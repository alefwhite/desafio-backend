import { BaseError } from '@/contracts/error/base-error'

export class ErrorEmailAlreadyExists extends BaseError {
  constructor() {
    super('Email already exists', 400)
    this.name = 'ErrorEmailAlreadyExists'
  }
}
