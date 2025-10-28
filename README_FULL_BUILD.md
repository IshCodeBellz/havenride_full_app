# HavenRide – Full Build (Unified)

This bundle combines all features we've produced: auto-assign, pickup PIN, chat, driver docs gate, dispatcher masked calls, profiles, admin (roles, settings, metrics, ops), earnings, accounting webhooks, receipts, and more.

## Quick start
1. **Install deps**:
   ```bash
   npm install
   ```
2. **Environment** – create `.env`:
   ```env
   DATABASE_URL=postgresql://user:pass@host:5432/havenride

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...

   # Ably (optional but recommended)
   NEXT_PUBLIC_ABLY_KEY=xxx:yyy
   ABLY_SERVER_KEY=xxx:yyy

   # Stripe (optional in dev)
   STRIPE_SECRET_KEY=sk_live_or_test
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test

   # Twilio (masked calling)
   PUBLIC_BASE_URL=https://your-app.vercel.app
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxx
   TWILIO_FROM_NUMBER=+44xxxxxxxxxx

   # Email (Resend) for receipts/confirmations
   RESEND_API_KEY=re_...

   # Accounting webhook (optional)
   ACCOUNTING_WEBHOOK_URL=https://example.com/accounting
   ACCOUNTING_WEBHOOK_SECRET=supersecret

   # Admin restrictions (optional)
   ADMIN_EMAIL_ALLOWLIST=ceo@yourorg.com,cto@yourorg.com

   # Fares fallback (DB Settings overrides at runtime)
   BASE_FARE=6
   PER_KM=1.8
   WHEELCHAIR_MULT=1.15

   # Payout rate (driver earnings)
   DRIVER_PAYOUT_RATE=0.75
   ```
3. **Generate & migrate Prisma**:
   ```bash
   npx prisma generate
   npx prisma migrate dev -n havenride_full_build
   ```
4. **Run**:
   ```bash
   npm run dev
   ```

## Key routes
- Rider: `/rider`, `/rider/profile`
- Driver: `/driver`, `/driver/profile`, `/driver/earnings`
- Dispatcher: `/dispatcher`
- Admin: `/admin`, `/admin/settings`, `/admin/metrics`, `/admin/ops`

## Notes
- Realtime uses **Ably**; without keys, UI degrades gracefully (no-op publish/subscribe).
- Payments: if Stripe is not set, a dummy client secret is used (dev only).
- Receipts & Accounting fire **best-effort** on completion and won’t block the driver flow.
