import {
  authenticate,
  authenticateSchema,
  create,
  refresh,
  usersSchema,
} from '@/http/controllers/users'

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

  app.post(
    '/authenticate',
    {
      schema: {
        summary: 'Realiza login de usuário',
        tags: ['Autenticações'],
        body: authenticateSchema,
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
          404: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
        },
      },
    },
    authenticate
  )

  app.patch(
    '/refresh',
    {
      schema: {
        summary: 'Renova o token de acesso',
        tags: ['Autenticações'],
        headers: z
          .object({
            cookie: z
              .string()
              .regex(/refreshToken=.*/)
              .describe('Cookie contendo o refresh token'),
          })
          .optional(),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
          401: z.object({
            error: z.string(),
            message: z.string(),
            details: z.array(z.string()).optional(),
          }),
        },
      },
    },
    refresh
  )
}
