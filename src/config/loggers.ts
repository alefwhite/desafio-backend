import fs from 'node:fs'
import path from 'node:path'
import * as process from 'node:process'
import pino from 'pino'
import { env } from './env'

// Define o caminho do diretório e do arquivo de log
const logDirectory = path.join(process.cwd(), 'logs') // Diretório de logs
const logFilePath = path.join(logDirectory, 'app.log') // Arquivo de log

// Verifica se o diretório existe, se não, cria o diretório
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true }) // Cria o diretório recursivamente
}

// Cria um stream para gravar logs em um arquivo
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' })

// Configura os destinos dos logs
const streams = [
  { stream: logStream }, // Grava logs no arquivo
]

// Em desenvolvimento, adiciona um stream para o terminal
if (env.NODE_ENV === 'development') {
  streams.push({
    stream: pino.transport({
      target: 'pino-pretty', // Exibe logs formatados no terminal
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        messageFormat: false,
      },
    }),
  })
}

// Configura o logger com múltiplos streams
export const loggerOptions = {
  level: 'error', // Apenas logs de erro serão gravados
  stream: pino.multistream(streams), // Envia logs para múltiplos destinos
}
