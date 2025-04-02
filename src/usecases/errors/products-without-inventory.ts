import { BaseError } from '@/contracts/error/base-error'

export class ErrorProductsWithoutInventory extends BaseError {
  constructor() {
    super('Products without inventory!', 404)
    this.name = 'ErrorProductsWithoutInventory'
  }
}
