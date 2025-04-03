import { makeCreateOrdersUseCase } from '@/usecases/factories/make-create-orders'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const ordersSchema = z.object({
  paymentMethod: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX']),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
    })
  ),
})

type ordersBody = z.infer<typeof ordersSchema>

export async function create(
  request: FastifyRequest<{ Body: ordersBody }>,
  reply: FastifyReply
) {
  const { paymentMethod, items } = request.body

  const createOrdersUseCase = await makeCreateOrdersUseCase({
    customerId: request.user.sub,
    items,
    paymentMethod,
  })

  return reply.status(201).send(createOrdersUseCase)
}
