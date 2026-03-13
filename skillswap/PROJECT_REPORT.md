# SkillSwap Project Report

## 1) Project Overview
SkillSwap is a peer-to-peer learning platform that enables users to learn and teach skills. The system uses a token economy, subscriptions, real-time lecture notes, and AI-assisted support. The stack is optimized for a modern deployment model using Supabase for backend services and Vercel for hosting and serverless APIs.

## 2) Objectives
- Provide a scalable learning marketplace for mentors and students.
- Implement a token system for paid content access.
- Enable subscriptions and UPI/card payments.
- Provide real-time collaboration features (notes sharing).
- Offer AI support with escalation to human review.
- Ensure profile completeness and engagement (reviews, ratings, bookmarks, certificates).

## 3) Scope
Included:
- User authentication and profile management
- Courses/lectures with video playback
- Token purchases and subscriptions
- Real-time notes sharing
- Notifications and messaging
- AI support assistant
- Reviews, ratings, and mentor profiles
- Certificates after course completion
- Explore courses with video listings

Excluded:
- Native mobile apps (current focus is web)
- Enterprise integrations (future work)

## 4) Architecture
- **Frontend:** React + Vite + Tailwind CSS
- **Backend (BaaS):** Supabase (Auth, Postgres DB, Storage, Realtime)
- **Serverless APIs:** Vercel functions for OpenRouter (AI) and Razorpay (payments)

Key components:
- `frontend/` – user interface and client logic
- `api/` – serverless endpoints
- `SUPABASE_SCHEMA.sql` – database schema

## 5) Database Design (Supabase)
Primary tables:
- `profiles` – user profile data
- `lectures`, `videos` – content metadata
- `notes`, `live_notes` – lecture notes (async + realtime)
- `payments`, `subscriptions`, `token_history` – monetization
- `notifications`, `messages` – engagement
- `reviews`, `ratings` – quality feedback
- `certificates` – completion certificates
- `bookmarks`, `follows` – social features

RLS (Row Level Security) policies enforce per-user access control.

## 6) Core Features
### a) Tokens
Users buy tokens via UPI or Razorpay (card/UPI). Tokens are deducted when accessing lectures.

### b) Subscriptions
Subscriptions enable extended access and premium features. Subscription purchases are recorded in Supabase.

### c) Real-time Notes
Students and teachers can share notes in real time using Supabase Realtime on `live_notes`.

### d) AI Support
The AI assistant uses OpenRouter (free model) to respond. If a query is complex, a support ticket is logged automatically.

### e) Certificates
Certificates are issued when a course is completed, and a notification is generated.

## 7) Security & Privacy
- Supabase Auth secures user accounts
- RLS policies restrict access to user-specific data
- Sensitive payment and AI keys are stored in server-side env vars

## 8) Testing Strategy
- Local dev: Vite + Vercel dev for serverless endpoints
- Supabase staging project for realistic data flows
- Manual smoke tests for auth, payments, and realtime

## 9) Deployment
- GitHub repo connected to Vercel
- Vercel auto-deploys on each push
- Supabase hosts database and storage

## 10) Future Enhancements
- Native mobile app
- Advanced recommendation engine
- Live video conferencing
- Admin analytics dashboard

## 11) Conclusion
SkillSwap delivers a complete learning marketplace with monetization, collaboration, and support features. The Supabase + Vercel architecture provides scalability, simplified backend management, and fast deployments.
