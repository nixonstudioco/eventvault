# EventVault — Setup Guide

## 1. Clone & Install

```bash
cd eventvault
npm install
```

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### Supabase
1. Create a project at https://supabase.com
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Supabase Storage Buckets
In the Supabase Dashboard → Storage, create these buckets:
- `event-media` — private (for uploaded photos/videos)
- `event-covers` — public (for event cover images)
- `qr-exports` — public (for exported QR posters)
- `user-avatars` — public (for user profile photos)

### Stripe
1. Create an account at https://stripe.com
2. Copy `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy `Secret key` → `STRIPE_SECRET_KEY`
4. Create two products (Basic Event $19, Premium Event $49) with recurring prices
5. Copy Price IDs → `STRIPE_BASIC_PRICE_ID` and `STRIPE_PREMIUM_PRICE_ID`
6. Set up webhook at `/api/stripe/webhook`, copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Update Stripe Price IDs in Database
After creating Stripe products, update the plans table:
```sql
UPDATE plans SET stripe_price_id = 'price_xxx' WHERE slug = 'basic';
UPDATE plans SET stripe_price_id = 'price_yyy' WHERE slug = 'premium';
```

### Resend (Email)
1. Sign up at https://resend.com
2. Copy API key → `RESEND_API_KEY`

## 3. Database Setup

Run the SQL migration in Supabase Dashboard → SQL Editor:
```
supabase/migrations/001_initial_schema.sql
```

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 5. Create First Admin

After your first user signs up, set their role to admin in the database:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (dashboard)/     # Organizer dashboard (protected)
│   ├── (admin)/         # Admin panel (admin-only)
│   ├── e/[slug]/        # Public event pages (upload + gallery)
│   ├── api/             # API routes (Stripe, auth callback)
│   └── pricing/         # Public pricing page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── auth/            # Auth forms
│   ├── dashboard/       # Dashboard components
│   ├── events/          # Event management components
│   ├── gallery/         # Public gallery
│   ├── upload/          # Upload page
│   ├── qr/              # QR code + poster designer
│   ├── landing/         # Landing page sections
│   └── admin/           # Admin panel components
├── lib/
│   ├── supabase/        # Supabase client (browser + server)
│   ├── stripe/          # Stripe client
│   └── utils/           # Shared utilities
└── types/               # TypeScript types
```

## Key Features

- **Event creation** with QR code auto-generation
- **Anonymous + account uploads** for guests
- **Media moderation** (approve/reject/delete)
- **Public gallery** with masonry layout + lightbox
- **Guestbook** with moderation
- **QR poster designer** with 6 themed templates
- **Stripe billing** with Basic ($19) and Premium ($49) plans
- **Admin dashboard** for platform management
- **Dark premium design** with glassmorphism
