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

  const { users, products } = schema

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

  await db.delete(products)
  await db.insert(products).values([
    { id: 1001, name: 'Smartphone X', price: '1999.99', stock: 50 },
    { id: 1002, name: 'Notebook Pro', price: '4999.99', stock: 30 },
    { id: 1003, name: 'Fone de Ouvido Wireless', price: '299.99', stock: 100 },
    { id: 1004, name: 'Mouse Gamer', price: '199.99', stock: 75 },
    { id: 1005, name: 'Teclado Mecânico', price: '349.99', stock: 60 },
  ])
  console.log('✅ Produtos criado!')
}

seed().catch(err => {
  console.error('❌ Erro ao executar seed:', err)
  process.exit(1)
})
