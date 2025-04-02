import { makeAuthenticateUseCase } from '@/usecases/factories/make-create-authenticate'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type authenticateBody = z.infer<typeof authenticateSchema>

export async function authenticate(
  request: FastifyRequest<{ Body: authenticateBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateUseCase()

  const user = await authenticateUseCase.execute({ email, password })

  const token = await reply.jwtSign(
    {
      role: user.role,
      name: user.name,
      email: user.email,
    },
    { sign: { sub: user.id } }
  )

  const refreshToken = await reply.jwtSign(
    {
      role: user.role,
      name: user.name,
      email: user.email,
    },
    { sign: { sub: user.id.toString(), expiresIn: '7d' } }
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
