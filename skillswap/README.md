# SkillSwap (Supabase + Vercel)

SkillSwap is a peer-to-peer learning platform with tokens, subscriptions, real-time notes, and AI support. The current app uses **Supabase** for auth/database/storage and **Vercel serverless functions** for AI + payment verification.

## Key Features
- Auth + profiles (name, surname, mobile, email, DOB, location)
- Courses/lectures with token-based access
- Real-time lecture notes sharing (Supabase Realtime)
- AI support assistant (OpenRouter) with human escalation
- Tokens purchase + subscriptions (UPI intent + Razorpay)
- Notifications, messages, bookmarks/wishlist
- Reviews/ratings and mentor profiles
- Certificates after course completion
- Explore courses shows all uploaded videos

## Tech Stack
- Frontend: React + Vite + Tailwind
- Backend: Supabase (DB/Auth/Storage)
- Serverless: Vercel Functions (`/api`) for OpenRouter + Razorpay

## Project Structure
```
skillswap/
+-- api/                      # Vercel serverless functions
+-- frontend/                 # React app (Vite)
+-- backend/                  # Legacy Node server (not required for current flow)
+-- SUPABASE_SCHEMA.sql
+-- SUPABASE_SETUP.md
+-- README.md
```

## Local Setup (Recommended)

### 1) Supabase
- Create a Supabase project.
- Run `SUPABASE_SCHEMA.sql` in the SQL editor.
- Create public buckets: `avatars`, `videos`.

### 2) Frontend env
Create `frontend/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROFILE_BUCKET=avatars
VITE_SUPABASE_VIDEO_BUCKET=videos
VITE_RAZORPAY_KEY=your_razorpay_key_id
```

### 3) Serverless env (for `/api`)
Create `.env` in repo root for local serverless dev:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_FREE_MODEL=optional_preferred_free_model
OPENROUTER_REFERER=http://localhost:3000
OPENROUTER_TITLE=SkillSwap Support AI
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4) Install
```bash
npm run setup
```

### 5) Run Serverless API (local)
```bash
npx vercel dev --listen 5000
```

### 6) Run Frontend
```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:3000`

## Deployment (Vercel)
1. Push repo to GitHub.
2. Import the repo into Vercel.
3. Set build settings:
   - Framework preset: Vite
   - Root: `frontend`
   - Build command: `npm run build`
   - Output: `dist`
4. Add env vars in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_PROFILE_BUCKET`
   - `VITE_SUPABASE_VIDEO_BUCKET`
   - `VITE_RAZORPAY_KEY`
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_FREE_MODEL` (optional)
   - `OPENROUTER_REFERER`
   - `OPENROUTER_TITLE`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

Vercel auto-deploys on every push to the connected branch.

## Notes
- The `backend/` folder is legacy and not required for Supabase + Vercel serverless flow.
- UPI intent works on mobile browsers; desktop will not open UPI apps.

## Scripts
- `npm run setup` - install frontend + backend deps
- `npm run frontend` - run Vite app
- `npm run backend` - run legacy backend
- `npm run dev` - run legacy backend + frontend (not needed if using Vercel dev)

## Support
For issues or feature requests, open an issue in the repo.
