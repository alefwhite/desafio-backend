# Desafio Técnico - Desenvolvedor Node.js Pleno

API REST para processar pedidos e gerenciar pagamentos.

## Stack Tecnológica

- Node.js (v22+)
- Fastify (Framework principal)
- PostgresSQL (Banco de dados)
- Drizzle ORM
- TypeScript
- PNPM (Gerenciador de pacotes)
- Vitest (Testes)
- Swagger (Documentação da API)

## Pré-requisitos

- Node.js >= 22.0.0
- PNPM >= 10.7.0
- PostgresSQL

## Configuração do Ambiente

Para configurar o ambiente de desenvolvimento, siga os seguintes passos:
1. Clone o repositório:

```bash
git clone git@github.com:alefwhite/desafio-backend.git
cd desafio-backend
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:

Caso tenha docker instalado execute: docker-compose up.

Senão utilize uma instalação local do postgres, para baixar acesse https://www.postgresql.org/

```bash
pnpm db-migrate
```

5. (Opcional) Execute o seed do banco de dados:

```bash
pnpm seed
```

## Scripts Disponíveis

- `pnpm dev` - Inicia o servidor em modo de desenvolvimento
- `pnpm build` - Compila o projeto para produção
- `pnpm start` - Inicia o servidor em modo de produção
- `pnpm test` - Executa os testes unitários
- `pnpm test:watch` - Executa os testes em modo watch
- `pnpm test:coverage` - Executa os testes com cobertura
- `pnpm db-generate` - Gera as migrações do Drizzle
- `pnpm db-migrate` - Executa as migrações do banco de dados

## Documentação da API

Exemplos de uso da API no arquivo routes.http

A documentação completa da API está disponível através do Swagger UI em: http://localhost:3000/docs

## Endpoints da API

Todos os endpoints da API (exceto autenticação e cadastro de usuário) requerem um token JWT válido no header `Authorization: Bearer <token>`.

### Autenticação

#### Criar Usuário

```http
POST /api/users
Content-Type: application/json

{
  "name": "Alef White",
  "email": "alefwhite@email.com",
  "password": "123456"
}
```

#### Login

```http
POST /api/authenticate
Content-Type: application/json

{
  "email": "alefwhite@email.com",
  "password": "123456"
}

// Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Renovar Token

```http
PATCH /api/refresh
Content-Type: application/json
Cookie: refreshToken=<seu-refresh-token>

{}
```

### Pedidos

#### Criar Pedido

```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <seu-token>

{
  "items": [
    {
      "productId": 1001,
      "quantity": 1
    },
    {
      "productId": 1002,
      "quantity": 1
    }
  ],
  "paymentMethod": "CREDIT_CARD" // Opções: CREDIT_CARD, BOLETO, PIX
}

// Resposta
{
  "id": 123,
  "status": "PENDING",
  "paymentLink": "https://..."
}
```

#### Consultar Pedido

```http
GET /api/orders/:orderId
Content-Type: application/json
Authorization: Bearer <seu-token>

// Resposta
[
  {
    "id": 123,
    "customerId": "uuid-do-cliente",
    "total": 1000,
    "paymentMethod": "CREDIT_CARD",
    "status": "PAID",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Webhook de Pagamento

#### Receber Atualização de Pagamento

```http
POST /webhook/payment
Content-Type: application/json

{
  "orderId": "123",
  "status": "APPROVED" // Opções: APPROVED, REPROVED
}

// Resposta
{
  "id": 123,
  "status": "PAID"
}
```

## Funcionalidades

### Simulação de Pagamento

- **Cartão de Crédito**: Aprovação automática e status "PAID"
- **Boleto**: Gera código fictício e status "PENDING"
- **PIX**: Gera código PIX fictício e status "PENDING"

### Status de Pagamento

- `PENDING`: Aguardando pagamento (Boleto/PIX)
- `PAID`: Pagamento aprovado
- `CANCELED`: Pagamento reprovado/cancelado

## Recursos de Segurança

- Rate Limiting: 100 requisições por minuto
- CORS configurado para `http://localhost:3000`
- Autenticação JWT
- Helmet para headers de segurança
- Refresh Token via cookies

## Desenvolvimento

O projeto utiliza várias ferramentas de desenvolvimento:

- Husky para git hooks
- Commitlint para padronização de commits
- Biome para linting
- TypeScript para tipagem estática
- Vitest para testes
- Pino para logging

## Logs

Em ambiente de desenvolvimento, os logs são formatados com pino-pretty e exibidos no console. Em produção, os logs são salvos em `./logs/app.log`.

## Licença

ISC
