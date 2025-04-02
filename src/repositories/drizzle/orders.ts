import type { ICreateOrder } from '@/contracts/repositories/orders'
import { orders } from '@/database'
import type * as schema from '@/database/schema'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleOrdersRepository implements ICreateOrder {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: ICreateOrder.Input): Promise<ICreateOrder.Output> {
    const [order] = await this.db
      .insert(orders)
      .values({
        customerId: data.customerId,
        total: data.total,
        paymentMethod: data.paymentMethod,
        status: data.paymentMethod === 'CREDIT_CARD' ? 'PAID' : 'PENDING',
      })
      .returning({ id: orders.id, status: orders.status })

    return {
      id: order.id,
      status: order.status,
    }
  }
}
