import { makeGetOrdersFromCustomersUseCase } from '@/usecases/factories/make-get-orders-from-customers'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const ordersCustomersSchema = z.object({
  orderId: z.string(),
})

type ordersParams = z.infer<typeof ordersCustomersSchema>

export async function getFromCustomers(
  request: FastifyRequest<{ Params: ordersParams }>,
  reply: FastifyReply
) {
  const { orderId } = request.params

  const getOrdersFromCustomersUseCase = makeGetOrdersFromCustomersUseCase()

  const orders = await getOrdersFromCustomersUseCase.execute({
    customerId: request.user.sub,
    orderId: Number(orderId),
  })

  return reply.status(200).send(orders)
}
