# Padrões de Arquitetura e Configuração para Projetos SaaS

Este documento define os padrões arquiteturais, estruturais e de boas práticas a serem seguidos na criação e manutenção de projetos SaaS. O objetivo principal é manter a consistência, segurança e manutenibilidade entre diferentes projetos.

---

## 1. Stack Tecnológica Base

- **Framework:** Next.js (Última versão) utilizando o **App Router**.
- **Linguagem:** TypeScript (Com tipagem estrita).
- **Banco de Dados & ORM:** PostgreSQL / Prisma ORM (Com validações adicionais estruturais).
- **Validação de Dados:** Zod (Utilizado de ponta a ponta: actions, rotas e formulários).
- **Estilização:** TailwindCSS (+ shadcn/ui para componentes base).

---

## 2. Arquitetura (MVC Adaptado)

Nossa arquitetura segue o modelo **MVC** (Model-View-Controller), mas perfeitamente adaptado para as particularidades do Next.js App Router e Server/Client Components.

### **M - Model (Camada de Dados)**
- **Onde:** Pasta `src/models/`
- **Responsabilidade:** Único local onde ocorre interação com o banco de dados (Prisma). Deve conter todas as operações de CRUD.
- **Regra:** Nenhuma Server Action, Rota de API ou Componente deve chamar o `prisma` diretamente. Eles devem chamar os métodos dos `Models`.

### **V - View (Camada de Apresentação)**
- **Onde:** Pasta `src/app/` (Pages/Layouts) e `src/components/`
- **Responsabilidade:** Renderização da UI.
- **Regra:** Componentes devem ser majoritariamente Server Components. Client Components (`"use client"`) devem ser criados apenas nas "folhas" da árvore (onde há real necessidade de estado ou interatividade como botões de formulário, modais, etc).

### **C - Controller (Server Actions)**
- **Onde:** Pasta `src/actions/`
- **Responsabilidade:** Orquestração técnica, unindo a View e o Model.
- **Regras:** 
  - Toda a regra de negócio passa por aqui.
  - A validação de escopo e acesso (ACL) ocorre antes da execução da lógica.

---

## 3. Segurança e Validações

### 🚫 Sem Middlewares Complexos
- **Uso do Middleware (`middleware.ts`):** O middleware do Next.js não deve ser utilizado para validações de acesso complexas, consultas ao banco ou manipulação de sessão profunda. O middleware só deve tratar redirecionamentos básicos (ex: i18n ou checagem de presença de token simples).
- **Motivo:** O Middleware roda no Edge runtime, o que limita importações (Node.js nativo, bcrypt, chamadas pesadas ao DB) e pode causar timeouts/lentidão na aplicação inteira.

### ✅ Server Actions como Guardiões (Gatekeepers)
- Toda autorização, validação de acesso e verificação de propriedade de dados (ex: "O usuário X é dono da entidade Y?") deve ser feita **dentro das Server Actions** ou **Rotas de API**.
- Todo input recebido pelo client deve ser rigorosamente validado usando schema do **Zod** logo na primeira linha da Server Action.

---

## 4. Decorators (Logs e Retry)

Para manter o código limpo ao lidar com observabilidade (logs) e resiliência (falhas temporárias, timeouts em banco, rate-limit de APIs externas), utilizamos padrões de Decorators (High Order Functions em TypeScript).

### `withLog`
Todas as Actions principais devem ser envelopadas para gerar rastreabilidade:
- O decorator registra quando a função iniciou, com quais argumentos (removendo senhas/dados sensíveis), quanto tempo demorou e qual foi o status ou erro na saída.

### `withRetry`
- Usado em integrações externas ou operações de banco que podem sofrer oscilações de rede.
- **Padrão:** Até **5 tentativas** de repetição em caso de erro transiente. Um *delay* exponencial (ex: 500ms, 1s, 2s) deve ser aplicado entre as tentativas antes de falhar de vez.

---

## 5. Estrutura de Diretórios Recomendada

```text
src/
├── app/                  # (Views) Páginas e Layouts
│   ├── (auth)/           # Rotas de Autenticação (Login/Register)
│   ├── (dashboard)/      # Rotas do sistema (App)
│   ├── api/              # Webhooks e integrações de terceiros
│   └── page.tsx          # Landing Page
├── models/               # (Models) Classes ou funções abstratas de DB
│   ├── user.model.ts     # Ex: UserModel.findById(id)
│   └── order.model.ts
├── actions/              # (Controllers) Server Actions
│   ├── user.actions.ts   
│   └── auth.actions.ts   
├── lib/                  # Utilitários, Configurações
│   ├── prisma.ts         # Instância singleton do Prisma
│   └── decorators/       # Wrappers (withLog.ts, withRetry.ts, withAuth.ts)
├── schemas/              # Schemas do Zod centralizados
├── hooks/                # Custom hooks (Client)
└── components/           # (Views) Componentes da Interface
    ├── ui/               # Componentes genéricos (Botões, Inputs - shadcn)
    └── shared/           # Componentes abstratos compartilhados
```

---

## 6. Exemplos Visuais de Implementação

### 6.1 Implementação de Decorators Base (`/lib/decorators/`)

```typescript
// /lib/decorators/withRetry.ts
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxRetries: number = 5
): T {
  return (async (...args: Parameters<T>) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn(...args);
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error(`[withRetry] Falha definitiva após ${maxRetries} tentativas.`);
          throw error;
        }
        // Espera de 1 segundo (Pode ser alterada para backoff exponencial)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }) as T;
}

// /lib/decorators/withLog.ts
export function withLog<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    const fnName = fn.name || 'Anonymous function';
    console.log(`[INFO] Executando ${fnName}...`);
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`[SUCCESS] ${fnName} finalizada em ${(end - start).toFixed(2)}ms.`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`[ERROR] ${fnName} falhou em ${(end - start).toFixed(2)}ms.`, error);
      throw error;
    }
  }) as T;
}

// /lib/decorators/withAuth.ts
export function withAuth<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    // Exemplo de verificação de sessão const session = await getSession();
    // if (!session) throw new Error("Unauthorized");
    // Opcional: Injetar a session como último argumento da função
    return await fn(...args);
  }) as T;
}

// /lib/decorators/withRateLimit.ts
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limit: number = 10,
  windowMs: number = 60000
): T {
  // OBS: Em Produção, use Redis ou similar para armazenar as requisições
  const requests = new Map<string, number[]>();

  return (async (...args: Parameters<T>) => {
    // Captura o IP ou ID do usuário (mock)
    const identifier = "user_or_ip_identifier"; 
    const now = Date.now();
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier)!;
    const windowStart = now - windowMs;
    // Limpa requests antigos
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= limit) {
      throw new Error(`Too Many Requests. Limite de ${limit} requisições atingido.`);
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);

    return await fn(...args);
  }) as T;
}

// /lib/decorators/withCache.ts
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttlMs: number = 60000
): T {
  // OBS: Em Produção, use Redis se rodar distribuído
  const cache = new Map<string, { data: any; expiry: number }>();

  return (async (...args: Parameters<T>) => {
    // Gera uma chave baseada nos argumentos
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      console.log(`[CACHE HIT] ${fn.name || 'Anonymous'}`);
      return cached.data;
    }

    const result = await fn(...args);
    cache.set(key, { data: result, expiry: Date.now() + ttlMs });
    console.log(`[CACHE MISS & SET] ${fn.name || 'Anonymous'}`);
    
    return result;
  }) as T;
}
```

### 6.2 Estrutura da Action com Validação

```typescript
// /actions/user.actions.ts
"use server";

/**
 * 📝 updateUserProfile
 * Responsável por receber os dados do formulário de usuário, 
 * validar os campos utilizando Zod e persistir os dados no banco via Prisma.
 */

import { withLog } from "@/lib/decorators/withLog";
import { withRetry } from "@/lib/decorators/withRetry";
import { withAuth } from "@/lib/decorators/withAuth";
import { UserModel } from "@/models/user.model";
import { UserUpdateSchema } from "@/schemas/user.schema";

// Action exposta para o client, envelopada com Múltiplos Decorators
export const updateUserProfile = withLog(
  withAuth( // Garante que apenas usuários logados chamem
    withRetry(async (userId: string, data: any) => {

      // 1. VALIDAÇÃO ZOD
      const parsedData = UserUpdateSchema.parse(data);

      // 2. EXECUÇÃO NO MODEL (Regra de Negócio Pura)
      const updatedUser = await UserModel.update(userId, parsedData);

      // 3. RETORNO PADRONIZADO (Utilizando DTOs explícitos se necessário)
      return { success: true, data: updatedUser };

    }, 3 /* 3 tentativas no retry da DB */)
  )
);
```

---

## 7. Boas Práticas Adicionais

### 🎯 Tratamento Padronizado de Erros (Error Handling)
Não jogue erros diretamente para o Frontend sem formatação. Sempre construa uma classe `AppError` ou utilize retornos no formato `ActionResponse`:

```typescript
export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; issues?: any[] };

// Exemplo nas actions:
try {
   const data = await Model.doSomething();
   return { success: true, data };
} catch (err: any) {
   return { success: false, error: err.message };
}
```

### 🧩 DTOs (Data Transfer Objects) explícitos
O Next.js/React requer que as respostas das Server Actions sejam objetos "plain" (simples) para serem serializados pelo React. O Prisma costuma retornar instâncias complexas ou datas que podem quebrar. 

- **Solução:** Na camada de Model, certifique-se de retornar objetos limpos (descarte dados de senha e garanta plain objects).

### 🚀 Padronização do `.env` e Env Variables
Como você usa Zod, adicione no projeto um arquivo `env.mjs` (ou `src/env.ts`) para forçar o Next.js a validar as variáveis de ambiente logo no "boot" da aplicação:

```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  //! Outras variáveis obrigatórias...
});

export const env = envSchema.parse(process.env);
```
Isso garante que o app *NÃO INICIA* e quebra no build (ou dev) se alguma variável esquecer de ser preenchida.
