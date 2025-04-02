import { env } from '@/config/env'
import type { ICreateOrder } from '@/contracts/repositories/orders'
import type { ICreateOrdersProducts } from '@/contracts/repositories/orders-products'
import type {
  IGetProductsByIds,
  IUpdateStock,
} from '@/contracts/repositories/products'
import { ErrorProductsWithoutInventory } from '@/usecases/errors'
import { ErrorProductsNotFound } from '@/usecases/errors/products-not-found'

type Product = {
  productId: number
  quantity: number
}

export type CreateOrderDTO = {
  customerId: string
  items: Product[]
  paymentMethod: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
}

export type CreateOrderResponse = {
  id: number
  status: string
  paymentLink: string
}

export class CreateOrdersUseCase {
  constructor(
    private readonly ordersRepository: ICreateOrder,
    private readonly ordersProductsRepository: ICreateOrdersProducts,
    private readonly productsRepository: IGetProductsByIds & IUpdateStock
  ) {}

  async execute(data: CreateOrderDTO): Promise<CreateOrderResponse> {
    // Buscar os produtos no banco de dados
    const productIds = data.items.map(p => p.productId)
    const existingProducts = await this.productsRepository.findByIds(productIds)

    if (existingProducts.length === 0) {
      throw new ErrorProductsNotFound()
    }

    // Criar um mapa para acesso rápido
    const productMap = new Map(existingProducts.map(p => [p.id, p]))

    // Filtrar apenas os produtos que existem, têm estoque suficiente e preço válido
    const validProducts = data.items
      .map(p => {
        const product = productMap.get(p.productId)
        if (
          !product ||
          product.stock < p.quantity ||
          product.price === undefined
        ) {
          return null // Remove produtos sem preço ou sem estoque suficiente
        }
        return {
          ...p,
          price: product.price, // Garantimos que o preço existe aqui
        }
      })
      .filter((p): p is Product & { price: number } => p !== null) // Remove `null` do array

    // Se nenhum produto for válido, retorna erro
    if (validProducts.length === 0) {
      throw new ErrorProductsWithoutInventory()
    }

    // Criar o pedido na tabela `orders`
    const order = await this.ordersRepository.create({
      customerId: data.customerId,
      total: validProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
      paymentMethod: data.paymentMethod,
    })

    // Criar os registros na tabela `orders_products`
    await this.ordersProductsRepository.create(
      validProducts.map(p => ({
        orderId: order.id,
        productId: p.productId,
        quantity: p.quantity,
        priceAtPurchase: p.quantity * p.price,
      }))
    )

    // Atualizar o estoque dos produtos que foram incluídos no pedido
    for (const product of validProducts) {
      const validProduct = productMap.get(product.productId)

      if (!validProduct) {
        continue
      }

      const stock = validProduct.stock - product.quantity

      await this.productsRepository.updateStock({
        id: product.productId,
        stock,
      })
    }

    return {
      id: order.id,
      status: order.status,
      paymentLink: `${env.BASE_URL}/pay/${order.id}`,
    }
  }
}
