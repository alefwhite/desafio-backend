export interface ICreateOrder {
  create: (input: ICreateOrder.Input) => Promise<ICreateOrder.Output>
}

export namespace ICreateOrder {
  export type Input = {
    customerId: string
    total: number
    paymentMethod: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  }

  export type Output = { id: number; status: string }
}

export interface IGetOrderByIdAndCustomerId {
  findByIdAndCustomerId: (
    input: IGetOrderByIdAndCustomerId.Input
  ) => Promise<IGetOrderByIdAndCustomerId.Output>
}

export namespace IGetOrderByIdAndCustomerId {
  export type Input = {
    orderId: number
    customerId: string
  }

  export type Output = {
    id: number
    customerId: string
    total: number
    status: string
    createdAt: Date
  }[]
}
