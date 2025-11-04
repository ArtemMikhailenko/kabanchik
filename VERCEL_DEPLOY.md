# Vercel Deployment Instructions

## Environment Variables Setup

To deploy this project on Vercel, you need to add the following environment variables in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables

#### Database
- `DATABASE_URL` - Your PostgreSQL database connection string

#### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

Get these from: https://dashboard.clerk.com/last-active?path=api-keys

#### Cloudinary (Image Uploads)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

Get these from: https://console.cloudinary.com/

### Optional Variables

#### Supabase (if using)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

#### Stripe (if using payments)
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

## Deployment Steps

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables listed above
4. Deploy!

## Troubleshooting

If you get an error about missing `publishableKey` for Clerk:
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in Vercel environment variables
- Redeploy the project after adding the variable
