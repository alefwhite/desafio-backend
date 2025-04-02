import { env } from '@/config/env'
import { app } from './app'

const PORT = env.PORT
app
  .listen({
    port: PORT,
  })
  .then(() => console.log(`HTTP Server Running port: ${PORT}.`))
