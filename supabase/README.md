# Supabase Setup

Local development uses a local Supabase instance. Production uses Supabase Cloud. Migrations in `supabase/migrations/` are the single source of truth.

## Quick Start

```bash
# 1. Start local Supabase
supabase start

# 2. Copy env (see .env.example) and get keys from:
supabase status

# 3. Run Next.js
npm run dev
```

## Local ↔ Cloud Workflow

### One-time: Link to Cloud Project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard) (or use existing).
2. Get your project ref from the URL: `https://supabase.com/dashboard/project/<project-ref>`
3. Run:

```bash
supabase login
supabase link --project-ref <project-ref>
```

4. If you have existing schema on the cloud that isn’t in migrations yet:

```bash
supabase db pull
```

### Daily Workflow

| Task | Command |
|------|---------|
| Start local DB | `supabase start` or `npm run db:start` |
| Stop local DB | `supabase stop` or `npm run db:stop` |
| Reset local DB (apply migrations) | `supabase db reset` or `npm run db:reset` |
| Apply new migration locally | `supabase db reset` |
| Push migrations to cloud | `supabase db push` or `npm run db:push` |
| Check migration status | `supabase migration list` |

### Making Schema Changes

**Option A: Manual migration**

```bash
supabase migration new add_my_feature
# Edit supabase/migrations/<timestamp>_add_my_feature.sql
supabase db reset
```

**Option B: Diff from Studio UI**

1. Open Studio: `http://127.0.0.1:54333` (or `supabase status` for URL)
2. Make changes in the Table Editor
3. Generate migration:

```bash
supabase db diff -f add_my_feature
supabase db reset
```

### Deploy to Production

```bash
# 1. Test locally
supabase db reset

# 2. Push to cloud
supabase db push
```

## Environment Variables

| Env | Local | Production |
|-----|-------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54331` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `supabase status` | From Dashboard → Settings → API |

Use `.env.local` for local development. Set production vars in your hosting provider (e.g. Vercel).

## Project Structure

```
supabase/
├── config.toml          # Local Supabase config
├── migrations/          # Schema migrations (ordered by timestamp)
│   ├── 001_initial.sql
│   ├── 002_roles_and_assignments.sql
│   └── ...
└── seed.sql             # Optional: seed data (run on db reset)
```

## Troubleshooting

- **Migration conflicts**: Run `supabase db diff` after push to see if local and remote match.
- **Fresh cloud project**: Run `supabase db push` once to apply all migrations.
- **DB version mismatch**: Ensure `config.toml` `db.major_version` matches remote (`SHOW server_version;` in SQL Editor).
