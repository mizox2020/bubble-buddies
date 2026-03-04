# Email Templates

Branded auth email templates for The Bubble Heroes.

## Confirm Signup Template

Uses the Bubble Heroes logo and brand colors (sky blue, pink, yellow/orange).

### Local Development

The template is wired in `config.toml`. After editing, restart Supabase:

```bash
supabase stop && supabase start
```

### Hosted (Supabase Cloud)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Set **Subject**: `You're almost a hero! Confirm your Bubble Heroes account`
4. Paste the contents of `confirm.html` into the **Message body** editor
5. Save

**Important:** In Supabase Dashboard → Auth → URL Configuration:
- Set **Site URL** to `https://thebubbleheros.com` (or your production domain)
- Add **Redirect URLs**: `https://thebubbleheros.com/**`, `https://www.thebubbleheros.com/**`

The confirmation link uses your domain (`/auth/confirm`) instead of Supabase's URL, so users never see the Supabase auth endpoint.
