import type {
  IGetProductsByIds,
  IUpdateStock,
} from '@/contracts/repositories/products'
import { products } from '@/database'
import type * as schema from '@/database/schema'
import { eq, inArray } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class DrizzleProductsRepository
  implements IGetProductsByIds, IUpdateStock
{
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findByIds(
    data: IGetProductsByIds.Input
  ): Promise<IGetProductsByIds.Output> {
    const productsById = await this.db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        stock: products.stock,
      })
      .from(products)
      .where(inArray(products.id, data))

    return productsById
  }

  async updateStock(data: IUpdateStock.Input): Promise<void> {
    await this.db
      .update(products)
      .set({ stock: data.stock })
      .where(eq(products.id, data.id))
  }
}
