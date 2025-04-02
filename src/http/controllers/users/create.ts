import { makeCreateUsersUseCase } from '@/usecases/factories/make-create-users'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const usersSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type signupBody = z.infer<typeof usersSchema>

export async function create(
  request: FastifyRequest<{ Body: signupBody }>,
  reply: FastifyReply
) {
  const { name, email, password } = request.body

  const createUsersUseCase = makeCreateUsersUseCase()

  const userId = await createUsersUseCase.execute({
    name,
    email,
    password,
  })

  return reply.status(201).send(userId)
}
