# Desafio Técnico - Desenvolvedor Node.js Pleno

## Visão Geral
Este desafio técnico tem como objetivo avaliar suas habilidades em desenvolvimento backend, integração com um gateway de pagamento (mockado ou real) e boas práticas de código.

Você deve criar uma **API REST** para processar pedidos e gerenciar pagamentos. O sistema permitirá que clientes criem pedidos, escolham um método de pagamento e simulem aprovação/rejeição da transação.

---

## Requisitos
### 1. Funcionalidades Obrigatórias
- **Cadastro de Pedidos**
  - Criar um pedido com **itens**, **quantidade**, **preço** e **método de pagamento** (cartão, boleto ou pix).
- **Simulação de Pagamento**
  - Se for **cartão**, a API deve aprovar o pedido automaticamente e marcar como "pago".
  - Se for **boleto**, a API deve gerar um código fictício e marcar o pedido como "aguardando pagamento".
  - Se for **pix**, a API deve gerar um código Pix fictício e marcar o pedido como "aguardando pagamento".
- **Consulta de Pedidos**
  - Permitir listar e visualizar detalhes de um pedido.
- **Webhook para Atualização de Pagamento**
  - Criar um **endpoint webhook** para receber atualizações de pagamento.
- **Banco de Dados**
  - Utilizar **PostgreSQL** com **Drizzle ORM** para armazenar pedidos e status de pagamento.

### 2. Requisitos Técnicos
- **Node.js** e **TypeScript**.
- **Express.js** ou **Fastify**.
- **Arquitetura baseada em Use Cases**.
- **Docker** para ambiente de desenvolvimento.
- **Autenticação via JWT** (pode ser apenas um token fixo para simplificar).
- **Boas práticas de arquitetura e clean code**.

### 3. Diferenciais (Extras, mas não obrigatórios)
- **Implementação real de um gateway de pagamento (ex: Pagar.me, Stripe, Mercado Pago, PayPal)**.
- **Mensageria** com Redis/SQS para processar pedidos assincronamente.
- **Testes unitários e/ou de integração**.
- Deploy em um serviço gratuito (Render, Railway, AWS Free Tier).

---

## Instruções para o Candidato
1. **Faça um fork deste repositório para a sua conta do GitHub**.
2. **Implemente a solução no repositório forkado**.
3. **Utilize um banco de dados PostgreSQL e Drizzle ORM**.
4. **Documente a API no README com exemplos de uso**.
5. **Envie o link do repositório do GitHub ao finalizar** para **[guilherme@upsurge.com.br]** com o assunto "Desafio Técnico - Node.js".

---

## Exemplos de Endpoints
### Criar Pedido
**POST /orders**
```json
{
  "customer": "João da Silva",
  "items": [
    { "product": "Livro Node.js", "quantity": 1, "price": 100 }
  ],
  "payment_method": "pix"
}
```
**Resposta**
```json
{
  "id": "abc123",
  "status": "pending",
  "payment_link": "https://fake-gateway.com/pay/abc123"
}
```

### Simular Webhook de Pagamento
**POST /webhook/payment**
```json
{
  "order_id": "abc123",
  "status": "approved"
}
```
**Resposta**
```json
{
  "id": "abc123",
  "status": "paid"
}
```

---

## Critérios de Avaliação
- **Clareza e organização do código**.
- **Uso de Use Cases na arquitetura**.
- **Uso correto do Drizzle ORM com PostgreSQL**.
- **Boas práticas de desenvolvimento**.
- **Capacidade de integração com APIs externas ou mockadas**.

---

## Considerações Finais
Para garantir uma entrega de qualidade, recomendamos que você siga as boas práticas de desenvolvimento, documente seu código e implemente testes sempre que possível.

Boa sorte! Se tiver dúvidas, fique à vontade para perguntar.