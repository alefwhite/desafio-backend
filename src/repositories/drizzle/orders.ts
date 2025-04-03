import type {
  ICreateOrder,
  IGetOrderByIdAndCustomerId,
} from '@/contracts/repositories/orders'
import { orders } from '@/database'
import type * as schema from '@/database/schema'
import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleOrdersRepository
  implements ICreateOrder, IGetOrderByIdAndCustomerId
{
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(data: ICreateOrder.Input): Promise<ICreateOrder.Output> {
    const [order] = await this.db
      .insert(orders)
      .values({
        customerId: data.customerId,
        total: data.total,
        paymentMethod: data.paymentMethod,
      })
      .returning({ id: orders.id, status: orders.status })

    return {
      id: order.id,
      status: order.status,
    }
  }

  async findByIdAndCustomerId(
    data: IGetOrderByIdAndCustomerId.Input
  ): Promise<IGetOrderByIdAndCustomerId.Output> {
    const order = await this.db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(
        and(eq(orders.id, data.orderId), eq(orders.customerId, data.customerId))
      )

    return order
  }
}
