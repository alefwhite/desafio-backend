export interface IGetProductsByIds {
  findByIds: (
    input: IGetProductsByIds.Input
  ) => Promise<IGetProductsByIds.Output>
}

export namespace IGetProductsByIds {
  export type Input = Array<number>

  export type Output = {
    id: number
    name: string
    price: number
    stock: number
  }[]
}

export interface IUpdateStock {
  updateStock: (input: IUpdateStock.Input) => Promise<IUpdateStock.Output>
}

export namespace IUpdateStock {
  export type Input = { id: number; stock: number }

  export type Output = void
}
