# Arquitetura sugerida (simples, MVC e fácil de manter)

Perfeito — para o seu cenário, o melhor é começar **simples**, mas já com base para crescer.

## 1) Direção principal

- Padrão **MVC** (Model, View, Controller) bem organizado.
- Pastas auxiliares claras: `helpers`, `actions`, `services`, `adapters`.
- Banco PostgreSQL.
- Next.js (versão atual) + Better Auth.
- Evolution como primeiro provedor WhatsApp.
- Projeto preparado para trocar provedor no futuro (Meta ou open source).
- **Área Admin global** para gerenciar usuários, permissões, limites e padrões do sistema.

---

## 2) Estrutura de pastas recomendada (Next.js + MVC adaptado)

```txt
src/
  app/                    # rotas/pages do Next.js (View)
    (admin)/              # telas admin (dashboard, usuários, planos, limites)
  controllers/            # recebe requisição e orquestra caso de uso
  models/                 # entidades e acesso ao banco (ou schema ORM)
  actions/                # casos de uso (regras de negócio)
  services/               # integrações e serviços de domínio
  adapters/
    whatsapp/             # adapter para Evolution, Meta, etc
    storage/              # adapter local, s3, r2...
  helpers/                # funções utilitárias puras
  lib/                    # configs compartilhadas (db, auth, logger)
  validations/            # zod schemas / validações
  types/                  # tipos globais
```

### Como separar responsabilidades
- **Controller**: valida entrada e chama action.
- **Action**: regra de negócio principal (ex.: agendar envio).
- **Service**: fluxo técnico (ex.: enviar mensagem para adapter whatsapp).
- **Adapter**: implementação concreta de provider (Evolution, S3, etc).
- **Helper**: utilitários sem regra de negócio.

Isso deixa manutenção mais fácil e reduz acoplamento.

---

## 3) Adapters (ponto mais importante para seu futuro)

### 3.1 Adapter de WhatsApp (pluggable)

Crie uma interface única para provedores:

```ts
export interface WhatsAppProvider {
  connect(instanceId: string): Promise<void>
  getGroups(instanceId: string): Promise<Array<{ id: string; name: string }>>
  sendText(params: { instanceId: string; groupId: string; text: string }): Promise<{ messageId: string }>
  sendMedia(params: {
    instanceId: string
    groupId: string
    text?: string
    mediaUrl: string
    mediaType: 'image'
  }): Promise<{ messageId: string }>
}
```

Implementações:
- `EvolutionWhatsAppAdapter` (agora)
- `MetaWhatsAppAdapter` (futuro)
- `OpenSourceWhatsAppAdapter` (futuro)

No código, controllers/actions **não conhecem Evolution diretamente** — só a interface.

### 3.2 Adapter de storage (local agora, S3 depois)

Interface:

```ts
export interface StorageProvider {
  upload(file: Buffer, path: string, contentType: string): Promise<{ url: string }>
  remove(path: string): Promise<void>
}
```

Implementações:
- `LocalStorageAdapter` (MVP)
- `S3StorageAdapter` (migração futura)

Assim você troca storage por configuração, sem refatorar regra de negócio.

---

## 4) Módulos do sistema

- **Auth e usuários** (Better Auth)
- **Área Admin global**
  - gerenciar usuários
  - ativar/desativar usuários
  - definir permissões por papel
  - configurar limites padrão para novos usuários
- **Instâncias WhatsApp**
- **Grupos** (sincronizados por instância)
- **Anúncios**
  - texto + 1 imagem
  - múltiplas imagens com textos
- **Agendamentos**
  - 1x por dia
  - várias vezes por intervalo
  - horários específicos
  - dias da semana (um ou vários)
- **Envios e fila**
- **Relatórios e histórico**

---

## 5) Controle de permissões e limites (o que você pediu)

Para atender seu caso (ex.: padrão 1 instância, mas admin muda para 5):

### 5.1 Padrões globais (Admin)
- `default_max_instances_per_user` (ex.: 1, 3, 5)
- `default_max_ads_per_user`
- `default_max_schedules_per_user`
- `default_max_groups_per_schedule`

Esses padrões são aplicados para **novos usuários** automaticamente.

### 5.2 Override por usuário
O admin pode personalizar limite por usuário:
- Usuário A: 1 instância
- Usuário B: 5 instâncias
- Usuário C: 20 anúncios

### 5.3 Papéis sugeridos
- `super_admin`: controla tudo (configuração global)
- `admin`: gerencia usuários e limites do workspace
- `operator`: cria anúncios/agendamentos/envios
- `viewer`: só visualiza dashboard e histórico

---

## 6) Banco de dados (PostgreSQL) — base mínima

Tabelas sugeridas:
- `users`
- `workspaces` (ou `tenants`)
- `workspace_members`
- `roles`
- `permissions`
- `workspace_member_permissions`
- `system_settings` (padrões globais)
- `user_limits` (override por usuário)
- `wa_instances`
- `wa_groups`
- `ads`
- `ad_items` (mídias/textos do anúncio)
- `schedules`
- `schedule_groups`
- `deliveries`
- `delivery_attempts`

Campos importantes:
- `workspace_id` em quase tudo (multi-tenant)
- `status`, `last_error`, `retry_count`
- `timezone`
- `created_at`, `updated_at`

---

## 7) Dashboard Admin (métricas principais)

Para sua necessidade de ver quantos usuários foram cadastrados:

- Total de usuários cadastrados
- Usuários ativos/inativos
- Novos usuários por período (dia/semana/mês)
- Total de instâncias conectadas
- Total de anúncios criados
- Total de agendamentos ativos
- Taxa de sucesso de envios
- Top usuários por volume de envio

Sugestão extra:
- filtros por período
- exportar CSV
- cards + gráficos simples para visão rápida

---

## 8) “Não bloqueios” para não travar operação

- Fila de jobs (não enviar direto da rota HTTP).
- Retry com backoff exponencial.
- Idempotência para evitar envio duplicado.
- Rate limit por instância.
- Delay aleatório entre envios.
- Pausa automática da instância quando taxa de erro subir.
- Dead-letter para falhas repetidas.
- Botão de reprocessar falhas no painel.
- Guardrails de plano: bloquear criação quando usuário atingir limite.

---

## 9) Fluxo simples recomendado

1. Usuário conecta instância (Evolution).
2. Sistema sincroniza grupos.
3. Usuário cria anúncio (texto/mídia).
4. Usuário configura agendamento (horários, intervalo, dias da semana).
5. Scheduler gera jobs da janela (ex.: próximas 24h).
6. Worker envia com controle de taxa + retry.
7. Dashboard mostra sucesso/falhas por instância/grupo/anúncio.
8. Admin acompanha uso e ajusta limites globais/individuais.

---

## 10) Roadmap prático

### MVP
- MVC organizado por pastas.
- Adapter WhatsApp só Evolution.
- Adapter storage local.
- Anúncio com texto + 1 imagem.
- Agendamento diário + dias da semana.
- Área Admin com:
  - gestão de usuários
  - papel/permissão
  - limites padrão e override
  - dashboard básico de cadastros

### Próxima fase
- Múltiplas imagens com texto por item.
- Storage S3.
- Adapter Meta WhatsApp.
- Adapter open source adicional.
- Regras de fallback entre instâncias.
- Dashboard avançado com métricas financeiras e retenção.

---

## 11) Resumo direto para seu cenário

Você quer algo simples e com fácil manutenção — então a melhor decisão é:

1. **MVC claro** para organização.
2. **Actions e services** para regra de negócio limpa.
3. **Adapters** para não prender seu sistema ao provider atual.
4. **Storage abstraction** para sair de local e ir para S3 sem dor.
5. **Área Admin forte** para controlar permissões e limites padrão.
6. **Contrato único de WhatsApp provider** para testar Evolution, Meta e outras APIs no futuro.

Se quiser, no próximo passo eu posso te entregar:
- estrutura real de pastas já pronta para copiar;
- schema SQL/Prisma com tabelas de limites e permissões;
- telas do admin (lista de usuários, limites e dashboard) em wireframe.
