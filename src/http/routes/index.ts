import { randomUUID } from 'node:crypto'
import { env } from '@/config/env'
import { db, orders } from '@/database'
import { ordersRoutes } from '@/http/routes/orders'
import { usersRoutes } from '@/http/routes/users'
import { webhookRoutes } from '@/http/routes/webhook'
import { ErrorOrderNotFound } from '@/usecases/errors/orders-not-found'
import { eq } from 'drizzle-orm'
import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

export const setupRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get(
    '/health-check',
    {
      schema: {
        tags: ['Health Check'],
        response: {
          200: z.object({
            system_checked: z.boolean(),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.status(200).send({ system_checked: true })
    }
  )

  app.register(webhookRoutes)

  app.get(
    '/api/pay/:orderId',
    {
      schema: {
        summary: 'Realizar Pagamento',
        tags: ['Pagamentos'],
        params: z.object({
          orderId: z.string(),
        }),
        response: {
          201: z.object({
            id: z.number(),
            status: z.string(),
            transactionCode: z.string().optional(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params as { orderId: string }

      if (!orderId) {
        return reply
          .status(400)
          .send({ error: 'Bad Request', message: 'orderId is required' })
      }

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, Number(orderId)))

      if (!order) {
        throw new ErrorOrderNotFound()
      }

      switch (order.status) {
        case 'PAID':
          return reply
            .status(400)
            .send({ error: 'Bad Request', message: 'Pedido já pago!' })
        case 'CANCELED':
          return reply
            .status(400)
            .send({ error: 'Bad Request', message: 'Pedido já cancelado!' })
      }

      if (order.paymentMethod === 'CREDIT_CARD') {
        const response = await fetch(`${env.BASE_URL}/webhook/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            status: 'APPROVED',
          }),
        })

        if (!response.ok) {
          throw new Error('Erro ao chamar o webhook')
        }

        const data = await response.json()

        return reply.send(data)
      }

      return {
        id: order.id,
        status: 'PENDING',
        transactionCode:
          order.paymentMethod === 'BOLETO'
            ? `BOLETO-${randomUUID().slice(0, 8)}`
            : `PIX-${randomUUID().slice(0, 8)}`,
      }
    }
  )

  const globalPrefix: string = '/api'

  app.register(usersRoutes, { prefix: globalPrefix })
  app.register(ordersRoutes, { prefix: globalPrefix })

  // app.patch(
  //   '/',
  //   { onRequest: [verifyUserRole('ADMIN')] },
  //   () => {},
  // )
}
