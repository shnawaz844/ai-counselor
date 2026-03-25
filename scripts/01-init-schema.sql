-- Drop existing types and tables if they exist
DROP TABLE IF EXISTS transcriptions CASCADE;
DROP TABLE IF EXISTS voice_calls CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS counselors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS speaker_type CASCADE;
DROP TYPE IF EXISTS call_status CASCADE;
DROP TYPE IF EXISTS communication_preference CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- Create ENUM types
CREATE TYPE user_type AS ENUM ('student', 'guardian', 'counselor');
CREATE TYPE communication_preference AS ENUM ('chat', 'voice', 'both');
CREATE TYPE call_status AS ENUM ('scheduled', 'ongoing', 'completed', 'missed');
CREATE TYPE speaker_type AS ENUM ('user', 'counselor');

-- Users table (extends Clerk auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type user_type NOT NULL DEFAULT 'student',
  preferred_communication communication_preference NOT NULL DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Counselors table
CREATE TABLE counselors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  expertise_areas TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  avatar_url TEXT NOT NULL,
  description TEXT NOT NULL,
  system_prompt TEXT NOT NULL DEFAULT 'You are an AI career counselor helping students and guardians make informed decisions about their academic and career paths.',
  is_active BOOLEAN DEFAULT true,
  supports_voice_calls BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table (for text chats)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'chat',
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for text chat messages)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice calls table
CREATE TABLE voice_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counselor_id UUID NOT NULL REFERENCES counselors(id) ON DELETE CASCADE,
  status call_status DEFAULT 'scheduled',
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcriptions table (for voice call transcripts)
CREATE TABLE transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES voice_calls(id) ON DELETE CASCADE,
  speaker speaker_type NOT NULL,
  text TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_counselor_id ON conversations(counselor_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_voice_calls_user_id ON voice_calls(user_id);
CREATE INDEX idx_voice_calls_counselor_id ON voice_calls(counselor_id);
CREATE INDEX idx_transcriptions_call_id ON transcriptions(call_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (TRUE);

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (TRUE);

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their conversations" ON messages
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert messages to their conversations" ON messages
  FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for voice calls
CREATE POLICY "Users can view their own voice calls" ON voice_calls
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create voice calls" ON voice_calls
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their voice calls" ON voice_calls
  FOR UPDATE USING (TRUE);

-- RLS Policies for transcriptions
CREATE POLICY "Users can view transcriptions from their calls" ON transcriptions
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert transcriptions" ON transcriptions
  FOR INSERT WITH CHECK (TRUE);

-- Counselors table is readable by everyone (public)
ALTER TABLE counselors DISABLE ROW LEVEL SECURITY;
