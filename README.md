# grupos-whatsapp-message-cron

Base inicial do SaaS para envio de anúncios em grupos de WhatsApp.

## Stack
- Next.js (App Router)
- TypeScript com tipagem clara
- PostgreSQL + Prisma
- Better Auth (preparado)
- Zod para validação de input em API e UI
- Arquitetura MVC + adapters

## Estrutura
- `src/controllers`: orquestra requisições
- `src/actions`: regras de negócio
- `src/services`: serviços de domínio
- `src/adapters`: integrações (whatsapp/storage)
- `src/helpers`: utilitários (validação/http/idempotência)

## Features já estruturadas
- Área admin (conceito) para limites e permissões
- API para criar instâncias e anúncios com validação de limites
- Respostas padronizadas com erros de validação amigáveis
- Decorator de retry plugável para providers WhatsApp
- Logging estruturado (JSON) para facilitar manutenção e observabilidade
- Adapter de WhatsApp (Evolution como padrão)
- Adapter de storage (local com migração para S3)
- Landing page AIDA focada na dor e resultado do usuário
- Alertas acessíveis (`aria-live`) no formulário inicial

## Rodar local
1. Copie `.env.example` para `.env`
2. Instale dependências
3. Rode:
   - `npm install`
   - `npm run db:generate`
   - `npm run dev`

## Endpoints
- `GET /api/health`
- `POST /api/instances`
- `POST /api/ads`
- `PUT /api/admin/settings`
