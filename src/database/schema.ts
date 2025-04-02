import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'CUSTOMER'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`), // Gera UUID automaticamente
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('CUSTOMER').notNull(), // Usando o enum definido acima
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
