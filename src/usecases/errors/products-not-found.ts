import { BaseError } from '@/contracts/error/base-error'

export class ErrorProductsNotFound extends BaseError {
  constructor() {
    super('Products not found!', 404)
    this.name = 'ErrorProductsNotFound'
  }
}
