import { env } from '@/config/env'
import { loggerOptions } from '@/config/loggers'
import { setupMiddlewares } from '@/config/middlewares'
import { errorHandler } from '@/http/middlewares/error-handler'
import { setupRoutes } from '@/http/routes'
import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify({
  logger: env.NODE_ENV === 'development' ? loggerOptions : false, // Desativa os logs em outros ambientes
}).withTypeProvider<ZodTypeProvider>()

setupMiddlewares(app)

app.register(setupRoutes)

app.setErrorHandler(errorHandler)

app.addHook('onError', async (request, _, error) => {
  if (env.NODE_ENV === 'production') {
    // Em produção usar um logger externo, como DataDog/NewRelic/Sentry
    console.log(
      'Em produção usar um logger externo, como DataDog/NewRelic/Sentry'
    )
  } else {
    request.log.error(error)
  }
})

export { app }
