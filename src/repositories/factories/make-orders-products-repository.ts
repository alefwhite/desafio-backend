import { db } from '@/database'
import { DrizzleOrdersProductsRepository } from '@/repositories/drizzle/orders-products'

export const makeOrdersProductsRepository =
  (): DrizzleOrdersProductsRepository => {
    return new DrizzleOrdersProductsRepository(db)
  }
