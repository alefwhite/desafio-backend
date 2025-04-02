import { db } from '@/database'
import { DrizzleProductsRepository } from '@/repositories/drizzle/products'

export const makeProductsRepository = (): DrizzleProductsRepository => {
  return new DrizzleProductsRepository(db)
}
