import { create, usersSchema } from '@/http/controllers/users/create'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const usersRoutes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        summary: 'Cadastrar usuário',
        tags: ['Usuários'],
        body: usersSchema,
        response: {
          201: z.object({
            id: z.string(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
        },
      },
    },
    create
  )
}
