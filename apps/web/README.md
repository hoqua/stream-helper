# Durablr - Vercel Integration

Simple Vercel Marketplace integration with OAuth support.

## Structure

```
/
├── src/app/
│   ├── api/
│   │   ├── callback/          # OAuth callback handler
│   │   ├── webhook/           # Vercel webhook events
│   │   └── hello/             # Test API endpoint
│   ├── configure/             # Integration configuration UI
│   ├── success/               # OAuth success page
│   ├── error/                 # OAuth error page
│   └── page.tsx               # Landing page
└── .env.local.example         # Environment variables template
```

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Get Client ID and Secret from Vercel Integration Console
3. Update environment variables
4. Deploy to Vercel

## Environment Variables

- `CLIENT_ID` - Your integration's Client ID from Vercel
- `CLIENT_SECRET` - Your integration's Client Secret from Vercel
- `NEXT_PUBLIC_HOST` - Your integration's URL (auto-configured on Vercel)

## OAuth Flow

1. User installs integration from Vercel Marketplace
2. Vercel redirects to `/api/callback` with auth code
3. Exchange code for access token
4. Redirect to `/configure` for setup or `/success`

## Webhook Events

The `/api/webhook` endpoint handles:

- `integration.configuration-created` - New installation
- `integration.configuration-removed` - Uninstalled
- `deployment.created` - New deployment

## Deploy to Vercel

```bash
npm run build
vercel --prod
```

Register your integration at https://vercel.com/integrations/console
