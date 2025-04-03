import { db } from '@/database'
import { DrizzleOrdersRepository } from '@/repositories/drizzle/orders'
import { DrizzleOrdersProductsRepository } from '@/repositories/drizzle/orders-products'
import { DrizzleProductsRepository } from '@/repositories/drizzle/products'
import {
  type CreateOrderDTO,
  CreateOrdersUseCase,
} from '@/usecases/orders/create'

export const makeCreateOrdersUseCase = async (ordersDTO: CreateOrderDTO) => {
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
