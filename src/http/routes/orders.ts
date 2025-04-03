import { create, ordersSchema } from '@/http/controllers/orders/create'
import {
  getFromCustomers,
  ordersCustomersSchema,
} from '@/http/controllers/orders/get-from-customers'
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

  app.get(
    '/orders/:orderId',
    {
      schema: {
        summary: 'Visualizar detalhes um pedido',
        tags: ['Pedidos'],
        params: ordersCustomersSchema,
        response: {
          200: z.array(
            z.object({
              id: z.number(),
              customerId: z.string().uuid(),
              total: z.number(),
              paymentMethod: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX']),
              status: z.string(),
              createdAt: z.date(),
            })
          ),
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
    getFromCustomers
  )
}
