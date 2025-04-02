import type { ICreateOrdersProducts } from '@/contracts/repositories/orders-products'
import { ordersProducts } from '@/database'
import type * as schema from '@/database/schema'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleOrdersProductsRepository implements ICreateOrdersProducts {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(
    data: ICreateOrdersProducts.Input
  ): Promise<ICreateOrdersProducts.Output> {
    await this.db.insert(ordersProducts).values(data)
  }
}
