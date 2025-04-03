import { makeOrdersRepository } from '@/repositories/factories/make-orders-repository'

import { GetOrdersFromCustomersUseCase } from '@/usecases/orders/get-from-customers'

export const makeGetOrdersFromCustomersUseCase =
  (): GetOrdersFromCustomersUseCase => {
    return new GetOrdersFromCustomersUseCase(makeOrdersRepository())
  }
