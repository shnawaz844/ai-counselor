// SETUP INSTRUCTIONS FOR AI CAREER COUNSELOR PLATFORM

/*

STEP 1: ENVIRONMENT VARIABLES
=============================

Add these environment variables to your Vercel project settings:

1. Clerk Authentication:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Get from https://dashboard.clerk.com/
   - CLERK_SECRET_KEY: Get from https://dashboard.clerk.com/

2. Google Gemini AI:
   - GOOGLE_GENERATIVE_AI_API_KEY: Get from https://aistudio.google.com/

3. Supabase (Already configured):
   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key


STEP 2: DATABASE SETUP
======================

The database schema will be automatically initialized when the app starts.

Tables created:
- users: Stores user profiles (extends Clerk auth)
- counselors: Pre-defined AI counselors with specializations
- conversations: Text chat conversations
- messages: Chat messages with role and content
- voice_calls: Voice consultation sessions
- transcriptions: Real-time transcription logs for voice calls


STEP 3: CLERK SETUP
====================

1. Create a Clerk account at https://clerk.com/
2. Create a new application
3. Copy your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
4. Configure sign-in/sign-up methods (recommend email/phone)
5. Add the env variables to your project


STEP 4: GOOGLE GEMINI API
==========================

1. Go to https://aistudio.google.com/
2. Create a new API key
3. Copy the API key and add it as GOOGLE_GENERATIVE_AI_API_KEY


STEP 5: RUN THE APP
===================

npm install
npm run dev

The app will be available at http://localhost:3000


FEATURES IMPLEMENTED
====================

✓ Landing Page with hero section
✓ Dashboard with counselor grid
✓ Text Chat System with Gemini AI
✓ Voice Call Interface (Zoom-like UI)
✓ Live Transcription Panel
✓ Chat History
✓ Voice Call History
✓ Profile Settings
✓ Clerk Authentication (Sign in/up, User menu)
✓ Pre-seeded AI Counselors (6 specialists)


COUNSELOR SPECIALIZATIONS
==========================

1. Engineering Career Advisor
2. Medical & Healthcare Counselor
3. Commerce & Business Specialist
4. Arts & Humanities Guide
5. Computer Science Expert
6. Entrepreneurship Coach


PAGES
=====

Public:
- / (Landing page)
- /sign-in (Clerk)
- /sign-up (Clerk)

Protected:
- /dashboard (Main dashboard with counselor grid)
- /chat/new (Text chat page)
- /voice/new (Voice call page)
- /history (Chat & Call history)
- /profile (User settings)


API ROUTES
==========

- POST /api/chat - Send chat message (streams with Gemini)
- GET /api/counselors - Fetch all counselors
- POST /api/voice/calls - Create voice call
- PATCH /api/voice/calls/[callId] - Update call status
- GET /api/voice/calls/[callId] - Get call details & transcriptions


ARCHITECTURE
============

Frontend:
- Next.js 15 App Router
- React 19
- TailwindCSS v4
- shadcn/ui components
- AI SDK 6 for streaming

Backend:
- Next.js API Routes
- Supabase PostgreSQL
- Google Gemini 1.5 Pro
- Clerk for authentication


NOTES FOR DEVELOPMENT
====================

1. Voice calls currently simulate transcriptions for demo purposes
2. To implement real voice recording, use Web Audio API + speech-to-text service
3. TTS (text-to-speech) for counselor voice can use browser API or cloud service
4. Ensure GOOGLE_GENERATIVE_AI_API_KEY is set before running chat

*/
