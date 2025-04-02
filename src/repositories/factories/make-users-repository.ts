import { db } from '@/database'
import { DrizzleUsersRepository } from '@/repositories/drizzle/users'

export const makeUsersRepository = (): DrizzleUsersRepository => {
  return new DrizzleUsersRepository(db)
}
