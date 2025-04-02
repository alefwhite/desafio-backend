import { usersRoutes } from '@/http/routes/users'
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

  const globalPrefix: string = '/api'

  app.register(usersRoutes, { prefix: globalPrefix })

  // app.patch(
  //   '/',
  //   { onRequest: [verifyUserRole('ADMIN')] },
  //   () => {},
  // )
}
