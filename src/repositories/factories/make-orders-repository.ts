import { db } from '@/database'
import { DrizzleOrdersRepository } from '@/repositories/drizzle/orders'

export const makeOrdersRepository = (): DrizzleOrdersRepository => {
  return new DrizzleOrdersRepository(db)
}
