import * as schema from './schema'

import { env } from '@/config/env'
import { Bcrypt } from '@/libs/bcrypt'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from './schema'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

async function seed() {
  console.log('🔄 Populando o banco de dados...')

  const { users } = schema

  const adminEmail = 'admin@admin.com'
  const [adminExists] = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))

  if (!adminExists) {
    const bcrypt = new Bcrypt()
    const hashedPassword = await bcrypt.hash('admin123')
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    })
    console.log('✅ Usuário ADMIN criado!')
  } else {
    console.log('⚠️ Usuário ADMIN já existe!')
  }
}

seed().catch(err => {
  console.error('❌ Erro ao executar seed:', err)
  process.exit(1)
})
