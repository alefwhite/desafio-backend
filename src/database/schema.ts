import { sql } from 'drizzle-orm'
import { integer } from 'drizzle-orm/pg-core'
import { numeric } from 'drizzle-orm/pg-core'
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

export const paymentMethodEnum = pgEnum('payment_method', [
  'CREDIT_CARD',
  'BOLETO',
  'PIX',
])

export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'PAID',
  'CANCELED',
])

export const orders = pgTable('orders', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  status: orderStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const products = pgTable('products', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ordersProducts = pgTable('orders_products', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: numeric('price_at_purchase', {
    precision: 10,
    scale: 2,
  }).notNull(),
})
