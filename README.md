# BeautyLine WebApp

BeautyLine WebApp is a Next.js application for courses, products, equipment rental/sales, and contact lead collection.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Main variables are listed in `.env.example`.

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for access token signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing
- `NEXT_PUBLIC_APP_URL`: Public app URL
- `RESEND_API_KEY`: Resend API key
- `CONTACT_FROM_EMAIL`: Verified sender email for contact and verification emails
- `CONTACT_TO_EMAIL`: Recipient email for contact form requests
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary media upload credentials
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe credentials
- `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACES_PLACE_ID`: Google Places key and place ID for live review snippets

## Local Data Seeding (Development Only)

The app supports automatic seed data when it starts **only in local development**.

### How it works

- Seeding runs during the first DB connection of the app runtime.
- It runs only when `NODE_ENV=development` and `ENABLE_LOCAL_SEED=true`.
- It is idempotent: each collection is seeded only if empty.

### Enable local seed

Add these to `.env.local`:

```bash
ENABLE_LOCAL_SEED=true
LOCAL_SEED_ADMIN_EMAIL=admin@beautyline.local
LOCAL_SEED_ADMIN_PASSWORD=Password123!
```

Then start the app:

```bash
npm run dev
```

Or run one-shot manual seed without starting the full app:

```bash
npm run seed:local
```

### What gets seeded

- 1 admin user (verified)
- Example services
- Example courses
- Example products
- Example equipment

### Important

- Keep `ENABLE_LOCAL_SEED=false` (or unset) outside local development.
- Do not enable local seed in staging/production environments.
