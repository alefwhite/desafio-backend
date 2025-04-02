import { create, ordersSchema } from '@/http/controllers/orders/create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const ordersRoutes: FastifyPluginAsyncZod = async app => {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/orders',
    {
      schema: {
        summary: 'Realiza um pedido',
        tags: ['Pedidos'],
        body: ordersSchema,
        response: {
          201: z.object({
            id: z.number(),
            status: z.string(),
            paymentLink: z.string().url(),
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
    create
  )
}
