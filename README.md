# WebTools - Central de Utilidades Online

Uma aplicação frontend moderna construída com Next.js 14+ e Supabase, oferecendo utilitários essenciais como Formatador de JSON e Bloco de Notas Online Compartilhável.

## 🚀 Tecnologias

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn/UI
- **Backend:** Supabase (PostgreSQL, Realtime, RLS)
- **Estado:** React Hooks, Zustand (disponível)

## 🛠️ Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone <url-do-repo>
   cd webtools
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-do-supabase
   ```

4. **Configure o Banco de Dados (Supabase)**
   
   **Opção 1: Usando o CLI (Recomendado)**
   ```bash
   # Vincule seu projeto local ao projeto Supabase
   npm run supabase:link
   
   # Aplique as migrações ao banco de dados
   npm run supabase:push
   ```
   
   Você precisará do **Project Reference ID** (encontrado nas configurações do projeto no Supabase Dashboard) e da **senha do banco de dados**.
   
   **Opção 2: Manualmente via Dashboard**
   Vá até o SQL Editor do seu projeto Supabase e execute o script contido em `supabase/migrations/00001_initial_schema.sql`.

5. **Execute a aplicação**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`.

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa o linter
- `npm run supabase:link` - Vincula projeto local ao Supabase remoto
- `npm run supabase:push` - Aplica migrações ao banco de dados remoto
- `npm run supabase:pull` - Puxa schema do banco de dados remoto
- `npm run supabase:types` - Gera tipos TypeScript do banco de dados
- `npm run db:setup` - Executa link + push automaticamente

Para mais detalhes sobre configuração do banco de dados, veja [supabase/README.md](./supabase/README.md).


## 📦 Módulos

### 1. Formatador de JSON
- Formatação (Pretty Print) com 2, 4 espaços ou Tab.
- Minificação.
- Validação de sintaxe.
- Cópia rápida para área de transferência.

### 2. Bloco de Notas Online
- Criação de notas com link único.
- Modo colaborativo (edição em tempo real).
- Modo somente leitura.
- Expiração configurável (1h, 24h, 7d, Nunca).

## 🔒 Segurança
- Todas as operações de banco de dados são protegidas por Row Level Security (RLS).
- Notas não colaborativas são estritamente somente leitura para terceiros.

## 🎨 Layout
- Interface limpa e responsiva.
- Tema escuro/claro (padrão do sistema/Shadcn).
