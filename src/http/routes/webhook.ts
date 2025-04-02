import { db, orders } from '@/database'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const webhookRoutes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/webhook/payment',
    {
      schema: {
        summary: 'Webhook de Pagamento Bem Sucedido',
        tags: ['Webhooks'],
        body: z.object({
          orderId: z.string(),
          status: z.enum(['APPROVED', 'REPROVED']),
        }),
        response: {
          201: z.object({
            id: z.number(),
            status: z.string(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { orderId, status } = request.body

      console.log(
        `📢 Webhook recebido para pedido ${orderId} com status: ${status}`
      )

      if (status === 'APPROVED') {
        console.log(
          `✅ Pedido ${orderId} foi aprovado! Atualizando no banco de dados...`
        )
        await db
          .update(orders)
          .set({ status: 'PAID' })
          .where(eq(orders.id, Number(orderId)))
      } else {
        console.log(`❌ Pedido ${orderId} não foi aprovado. Status: ${status}`)
        await db
          .update(orders)
          .set({ status: 'CANCELED' })
          .where(eq(orders.id, Number(orderId)))
      }

      return reply
        .status(201)
        .send({ id: Number(request.body.orderId), status: request.body.status })
    }
  )
}
