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
