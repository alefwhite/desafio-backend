import { db } from '@/database'
import { DrizzleOrdersRepository } from '@/repositories/drizzle/orders'
import { DrizzleOrdersProductsRepository } from '@/repositories/drizzle/orders-products'
import { DrizzleProductsRepository } from '@/repositories/drizzle/products'
import {
  type CreateOrderInput,
  CreateOrdersUseCase,
} from '@/usecases/orders/create'

export const makeCreateOrdersUseCae = async (ordersDTO: CreateOrderInput) => {
  const response = await db.transaction(async tx => {
    const useCase = new CreateOrdersUseCase(
      new DrizzleOrdersRepository(tx),
      new DrizzleOrdersProductsRepository(tx),
      new DrizzleProductsRepository(tx)
    )

    return useCase.execute(ordersDTO)
  })

  return response
}
