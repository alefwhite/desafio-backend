type OrderProduct = {
  orderId: number
  productId: number
  quantity: number
  priceAtPurchase: number
}

export interface ICreateOrdersProducts {
  create: (
    input: ICreateOrdersProducts.Input
  ) => Promise<ICreateOrdersProducts.Output>
}

export namespace ICreateOrdersProducts {
  export type Input = Array<OrderProduct>

  export type Output = void
}
