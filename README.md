# 💸 MindMoney — Stack Completa

**Next.js 14 · Supabase · Google OAuth · TypeScript**

---

## Stack

| Camada       | Tecnologia                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router)           |
| Linguagem   | TypeScript                        |
| Banco       | Supabase (PostgreSQL)             |
| Auth        | Supabase Auth + Google OAuth      |
| IA          | Anthropic Claude (Server Action)  |
| Gráficos    | Recharts                          |
| Deploy      | Vercel (recomendado)              |

---

## 1. Clonar e instalar

```bash
git clone <seu-repo>
cd mindmoney-stack
npm install
cp .env.example .env.local
```

---

## 2. Configurar Supabase

### 2.1 Criar projeto
Acesse [supabase.com](https://supabase.com) → New Project

### 2.2 Executar o schema
No **SQL Editor** do Dashboard Supabase, cole e execute todo o conteúdo de `supabase/schema.sql`.

Isso cria:
- Tabela `profiles` (criada automaticamente no signup via trigger)
- Tabela `transactions` com RLS
- Tabela `user_badges` com RLS
- View `monthly_summaries`
- Trigger de streak automático
- Trigger de criação de perfil

### 2.3 Pegar as chaves
`Settings → API` → copie:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. Configurar Google OAuth

### 3.1 Google Cloud Console
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto (ou use um existente)
3. `APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID`
4. Tipo: **Web Application**
5. Authorized redirect URIs:
   ```
   https://SEU_PROJECT_ID.supabase.co/auth/v1/callback
   ```
6. Copie o **Client ID** e **Client Secret**

### 3.2 Ativar no Supabase
`Authentication → Providers → Google`
- Enable Google provider ✓
- Cole o Client ID e Client Secret
- Save

### 3.3 Configurar URL no Supabase
`Authentication → URL Configuration`
- Site URL: `http://localhost:3000` (dev) ou `https://seu-dominio.com` (prod)
- Redirect URLs: adicione `http://localhost:3000/auth/callback`

---

## 4. Variáveis de ambiente

Preencha `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Rodar localmente

```bash
npm run dev
# → http://localhost:3000
```

---

## 6. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Configure as env vars no painel da Vercel e atualize:
- Supabase Site URL → sua URL de produção
- Supabase Redirect URLs → `https://seu-dominio.com/auth/callback`
- Google OAuth Authorized URIs → `https://SEU_PROJECT_ID.supabase.co/auth/v1/callback`

---

## 7. Gerar tipos TypeScript (opcional)

Mantém `types/database.ts` sempre sincronizado com o banco:

```bash
npx supabase gen types typescript \
  --project-id SEU_PROJECT_ID \
  --schema public \
  > types/database.ts
```

---

## 8. Arquitetura

```
app/
├── layout.tsx                 # Root layout (fonte, meta)
├── page.tsx                   # Redirect → /dashboard ou /login
├── login/page.tsx             # Tela de login com Google
├── auth/callback/route.ts     # Handler OAuth callback
└── dashboard/
    ├── layout.tsx             # Auth guard + DataProvider + BottomNav
    ├── page.tsx               # Home (anel + IA + transações)
    ├── analytics/page.tsx     # Gráficos e análises
    └── achievements/page.tsx  # Badges e gamificação

components/
├── providers/DataProvider.tsx # Context + estado global + otimistic updates
├── SpendingRing.tsx           # SVG animado de saúde financeira
├── AddTransactionModal.tsx    # Modal de cadastro de gasto
└── BottomNav.tsx              # Navegação inferior

lib/
├── supabase/client.ts         # Supabase browser client
├── supabase/server.ts         # Supabase server client (SSR)
├── constants.ts               # Categorias, badges, níveis, paleta
└── actions.ts                 # Server Actions (CRUD + IA + badge engine)

middleware.ts                  # Proteção de rotas + refresh de sessão
supabase/schema.sql            # Schema completo (tabelas, RLS, triggers)
```

---

## 9. Funcionalidades implementadas

### Auth
- [x] Login com Google OAuth (popup ou redirect)
- [x] Criação automática de perfil no primeiro acesso
- [x] Proteção de rotas via middleware
- [x] Refresh automático de sessão

### Transações
- [x] Cadastro com categoria, valor, descrição e data
- [x] Exclusão com confirmação
- [x] Classificação automática de gastos fúteis
- [x] Histórico do mês atual

### Dashboard
- [x] Anel de saúde financeira animado (verde/âmbar/vermelho)
- [x] Orçamento mensal configurável por usuário
- [x] Resumo de fúteis vs. essenciais
- [x] Alerta automático quando fúteis > 25% do total

### IA (Anthropic)
- [x] Análise dos gastos via Server Action (API key segura no servidor)
- [x] 3 dicas personalizadas + alerta de categoria + projeção de economia
- [x] Fallback em caso de erro de API

### Análise
- [x] Gráfico de pizza por categoria
- [x] Gráfico de barras mensal (últimos 6 meses)
- [x] Breakdown de gastos fúteis
- [x] Projeção de economia (30% e 50% de corte)

### Gamificação
- [x] 8 níveis de maturidade financeira
- [x] 12 badges com regras automáticas
- [x] Badge engine no servidor (avalia a cada transação)
- [x] Streak automático via trigger no banco
- [x] XP acumulado por badges desbloqueados
- [x] Calendário de sequência visual

### UX
- [x] Optimistic updates (UI atualiza instantaneamente)
- [x] Server Actions com revalidação de cache
- [x] Dados carregados no server (sem loading state inicial)
- [x] Mobile-first (max-width 430px)
- [x] Tema escuro consistente

---

## 10. Próximos passos sugeridos

- [ ] PWA com service worker (instalar como app no celular)
- [ ] Notificações push para metas e streaks
- [ ] Orçamento por categoria
- [ ] Exportação de relatório em PDF
- [ ] Suporte a múltiplos meses e histórico completo
- [ ] Compartilhamento de conquistas
- [ ] Dark/light mode toggle
- [ ] Internacionalização (i18n)
