# 🌸 Lilys — Maturidade Financeira

> Controle seus gastos, acompanhe suas entradas e evolua financeiramente com gamificação.

---

## Stack

| | |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Google OAuth via Supabase |
| Deploy | Vercel |

---

## Funcionalidades

- **Dashboard** com anel de saúde financeira
- **Gastos e entradas** com categorias automáticas
- **Detecção de gastos fúteis** com alertas
- **Análise mensal** com gráficos e taxa de poupança
- **Família** — grupo compartilhado com link de convite de 15 minutos
- **Conquistas** — sistema de badges e níveis (Iniciante → Guru Financeira)
- **Coach por IA** — em breve

---

## Configuração

### 1. Clone e instale
```bash
git clone https://github.com/MarcxS77/Lily-s-finance-management
cd Lily-s-finance-management
npm install
cp .env.example .env.local
```

### 2. Configure as variáveis de ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

### 3. Execute o schema no Supabase
Cole o conteúdo de `supabase/schema.sql` no SQL Editor do Supabase.

### 4. Rode localmente
```bash
npm run dev
```

