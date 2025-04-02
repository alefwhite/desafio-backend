import { BaseError } from '@/contracts/error/base-error'

export class ErrorOrderNotFound extends BaseError {
  constructor() {
    super('Order not found!', 404)
    this.name = 'ErrorOrderNotFound'
  }
}
