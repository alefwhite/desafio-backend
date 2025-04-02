import type {
  ICreateUser,
  IGetUserByEmail,
} from '@/contracts/repositories/users'
import { users } from '@/database'
import type * as schema from '@/database/schema'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleUsersRepository implements ICreateUser, IGetUserByEmail {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: ICreateUser.Input): Promise<ICreateUser.Output> {
    const [user] = await this.db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: 'CUSTOMER',
      })
      .returning({ id: users.id })

    return {
      id: user.id,
    }
  }

  async findByEmail(
    input: IGetUserByEmail.Input
  ): Promise<IGetUserByEmail.Output> {
    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, input.email))

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
