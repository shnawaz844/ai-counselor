# AI Career Counselor Platform

A modern web application connecting students and guardians with AI-powered career counselors for personalized guidance on college selection, course planning, and career path optimization.

## Features

### Core Features
- **Dual Mode Consultation**: Chat-based and voice-call based counseling sessions
- **AI-Powered Guidance**: Powered by Google Gemini 1.5 Pro for intelligent career advice
- **Real-time Transcription**: Live transcription logging during voice calls with speaker identification
- **Multiple Specializations**: 6 pre-configured AI counselors covering different fields
- **Conversation History**: Track all past chats and voice call transcripts
- **Secure Authentication**: Clerk-based user authentication and authorization

### Counselor Specializations
1. **Engineering Career Advisor** - IIT/NIT preparation, tech careers
2. **Medical & Healthcare Counselor** - NEET, medical colleges, healthcare careers
3. **Commerce & Business Specialist** - Accounting, finance, entrepreneurship
4. **Arts & Humanities Guide** - Liberal arts, civil services, media
5. **Computer Science Expert** - Software development, data science, cybersecurity
6. **Entrepreneurship Coach** - Startup ideas, business planning, funding

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TailwindCSS v4
- shadcn/ui components
- AI SDK 6 (for streaming)

**Backend:**
- Next.js API Routes
- Supabase PostgreSQL
- Google Gemini 1.5 Pro API
- Clerk Authentication

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Clerk account (https://clerk.com/)
- Google AI Studio account (https://aistudio.google.com/)
- Supabase project (already configured)

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Add to your Vercel project settings:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to http://localhost:3000

## Usage

### For Students/Guardians
1. Sign up with email or phone via Clerk
2. Complete your profile
3. Browse available AI counselors
4. Choose between chat or voice call consultation
5. Ask questions about careers, colleges, and courses
6. View chat history and voice call transcripts

### Chat Mode
- Type your questions directly
- Get instant responses from AI counselor
- All messages are saved automatically
- Access chat history anytime

### Voice Call Mode
- Zoom-like interface with counselor avatar
- Real-time transcription on right panel
- Speaker identification (You vs Counselor)
- Timestamps for each transcription entry
- Copy or download transcript after call

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx              # Root layout with Clerk provider
├── middleware.ts           # Clerk authentication middleware
├── dashboard/
│   └── page.tsx           # Main dashboard
├── chat/
│   └── new/
│       └── page.tsx       # Chat interface
├── voice/
│   └── new/
│       └── page.tsx       # Voice call interface
├── history/
│   └── page.tsx           # Consultation history
├── profile/
│   └── page.tsx           # User settings
└── api/
    ├── counselors/
    │   └── route.ts       # Counselor list & seed
    ├── chat/
    │   └── route.ts       # Chat with Gemini streaming
    └── voice/
        └── calls/
            ├── route.ts   # Create/list calls
            └── [callId]/
                └── route.ts  # Update call & get transcript

lib/
├── db-init.ts             # Database initialization
└── utils.ts               # Utility functions

public/                     # Static assets
```

## Database Schema

### Tables
- **users**: User profiles (extends Clerk auth)
- **counselors**: Pre-defined AI counselor personas
- **conversations**: Text chat sessions
- **messages**: Individual chat messages
- **voice_calls**: Voice consultation sessions
- **transcriptions**: Transcription entries with timestamps

## API Endpoints

### Chat
- `POST /api/chat` - Send message (streams response)
- `GET /api/counselors` - Get all counselors

### Voice Calls
- `POST /api/voice/calls` - Initiate call
- `PATCH /api/voice/calls/[callId]` - Update call status
- `GET /api/voice/calls/[callId]` - Get call & transcriptions

## Future Enhancements

- [ ] Real-time audio recording and streaming
- [ ] Text-to-speech (TTS) for counselor responses
- [ ] Video call support
- [ ] Advanced analytics on consultations
- [ ] Personalized career recommendations
- [ ] College/course database integration
- [ ] Payment integration for premium features
- [ ] Admin dashboard for counselor management
- [ ] Multi-language support
- [ ] Mobile app

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Add environment variables in Vercel settings
4. Deploy automatically on push

## Environment Setup Guide

See `SETUP.md` for detailed setup instructions.

## License

Private/Internal Use

## Support

For issues or questions, please contact support.

---

**Built with Next.js, Gemini AI, and Supabase**
