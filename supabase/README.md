# Supabase Database Setup

Este guia explica como configurar e gerenciar o banco de dados Supabase usando o CLI.

## Pré-requisitos

1. Ter uma conta no [Supabase](https://supabase.com)
2. Criar um novo projeto no Supabase
3. Ter as credenciais do projeto (URL e Anon Key) configuradas no `.env.local`

## Scripts Disponíveis

### 1. Vincular o projeto local ao Supabase

```bash
npm run supabase:link
```

Este comando vincula seu projeto local ao projeto remoto no Supabase. Você precisará:
- Do **Project Reference ID** (encontrado nas configurações do projeto no Supabase)
- Da sua **senha do banco de dados** (definida ao criar o projeto)

### 2. Aplicar migrações ao banco de dados remoto

```bash
npm run supabase:push
```

Este comando aplica todas as migrações da pasta `supabase/migrations/` ao banco de dados remoto.

### 3. Puxar o schema do banco de dados remoto

```bash
npm run supabase:pull
```

Este comando baixa o schema atual do banco de dados remoto e cria uma nova migration.

### 4. Gerar tipos TypeScript

```bash
npm run supabase:types
```

Gera tipos TypeScript baseados no schema do banco de dados local.

### 5. Setup completo (Link + Push)

```bash
npm run db:setup
```

Este comando executa automaticamente o link e o push das migrações.

## Passo a Passo - Primeira Configuração

1. **Vincule o projeto:**
   ```bash
   npm run supabase:link
   ```
   - Cole o Project Reference ID quando solicitado
   - Digite a senha do banco de dados

2. **Aplique as migrações:**
   ```bash
   npm run supabase:push
   ```
   
   Ou use o comando combinado:
   ```bash
   npm run db:setup
   ```

3. **Verifique no Supabase Dashboard:**
   - Acesse o Table Editor
   - Confirme que a tabela `notes` foi criada
   - Verifique as políticas RLS em Authentication > Policies

## Estrutura de Migrações

As migrações ficam em `supabase/migrations/`:
- `00001_initial_schema.sql` - Schema inicial com tabela notes e políticas RLS

## Troubleshooting

- **Erro de autenticação:** Verifique se o Project Reference ID e a senha estão corretos
- **Erro de permissão:** Certifique-se de que você tem acesso de administrador ao projeto
- **Conflitos de schema:** Use `npm run supabase:pull` para sincronizar com o remoto antes de fazer push
