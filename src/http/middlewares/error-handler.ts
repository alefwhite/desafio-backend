import { BaseError } from '@/contracts/error/base-error'
import type { FastifyInstance } from 'fastify'
import {
  type ZodFastifySchemaValidationError,
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

function isErrorBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError
}

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const validation = error.validation as ZodFastifySchemaValidationError[]
    const errors = validation.map(
      (error, ind) =>
        `Error #${ind + 1}, Code: ${error.params.issue.code}, name: ${error.params.issue.path.join(
          '.'
        )}, message: ${error.params.issue.message}`
    )
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      details: errors,
    })
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
    })
  }

  if (isErrorBaseError(error)) {
    return reply.status(error.statusCode).send({
      error: 'An error occurred',
      message: error.message,
      details: error.details,
    })
  }

  return reply.status(500).send({ message: 'Internal server error!' })
}
