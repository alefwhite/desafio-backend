import type { IGetOrderByIdAndCustomerId } from '@/contracts/repositories/orders'

type OrderDTO = {
  customerId: string
  orderId: number
}

export class GetOrdersFromCustomersUseCase {
  constructor(private readonly ordersRepository: IGetOrderByIdAndCustomerId) {}

  async execute(input: OrderDTO): Promise<IGetOrderByIdAndCustomerId.Output> {
    return this.ordersRepository.findByIdAndCustomerId(input)
  }
}
