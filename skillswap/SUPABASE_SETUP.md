# Supabase Setup (SkillSwap)

This project now uses Supabase for auth, database, and storage. Follow these steps before running locally or deploying to Vercel.

## 1) Create Supabase Project
- Create a new project in Supabase.
- Copy the Project URL and anon key.

## 2) Run Schema
- Open the SQL Editor in Supabase.
- Run `SUPABASE_SCHEMA.sql` from this repo.

## 3) Create Storage Buckets
- Create two public buckets:
  - `avatars`
  - `videos`

## 4) Configure Environment Variables
Create `frontend/.env` using `frontend/.env.example`:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROFILE_BUCKET=avatars
VITE_SUPABASE_VIDEO_BUCKET=videos
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

Create serverless env vars on Vercel for AI + payments:

```
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_FREE_MODEL=optional_preferred_free_model
OPENROUTER_REFERER=https://your-domain.com
OPENROUTER_TITLE=SkillSwap Support AI
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 5) Vercel
- Add the same environment variables in your Vercel project settings.
- Deploy the `frontend` app.

## Notes
- Payments are recorded in the `payments` table. For real payment confirmation, use a Vercel Serverless Function or Supabase Edge Function to verify provider callbacks and update `payments`/`subscriptions`.
